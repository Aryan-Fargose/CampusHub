import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function calculateCooldown(usernameChangedAt: string | null | undefined): {
  canChange: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  nextAllowedDate: Date | null;
} {
  if (!usernameChangedAt) {
    return {
      canChange: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      nextAllowedDate: null,
    };
  }

  const lastChanged = new Date(usernameChangedAt).getTime();
  if (isNaN(lastChanged)) {
    return {
      canChange: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      nextAllowedDate: null,
    };
  }

  const now = Date.now();
  const diff = now - lastChanged;

  if (diff >= SEVEN_DAYS_MS) {
    return {
      canChange: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      nextAllowedDate: null,
    };
  }

  const remainingMs = SEVEN_DAYS_MS - diff;
  const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const hoursRemaining = Math.ceil(remainingMs / (60 * 60 * 1000));
  const nextAllowedDate = new Date(lastChanged + SEVEN_DAYS_MS);

  return {
    canChange: false,
    daysRemaining,
    hoursRemaining,
    nextAllowedDate,
  };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let username = user.user_metadata?.username || null;
    let usernameChangedAt = user.user_metadata?.username_changed_at || null;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, username_changed_at")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.username) username = profile.username;
        if (profile.username_changed_at) usernameChangedAt = profile.username_changed_at;
      }
    } catch {
      // Profiles table might not be initialized yet
    }

    const cooldown = calculateCooldown(usernameChangedAt);

    return NextResponse.json({
      username,
      username_changed_at: usernameChangedAt,
      can_change: cooldown.canChange,
      days_remaining: cooldown.daysRemaining,
      hours_remaining: cooldown.hoursRemaining,
      next_allowed_date: cooldown.nextAllowedDate?.toISOString() || null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch username status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be authenticated to change your scholar name." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const newUsername = typeof body.username === "string" ? body.username.trim() : "";

    // Validation
    if (!newUsername) {
      return NextResponse.json({ error: "Please provide a valid username." }, { status: 400 });
    }

    if (newUsername.length < 2) {
      return NextResponse.json(
        { error: "Username must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (newUsername.length > 20) {
      return NextResponse.json(
        { error: "Username cannot exceed 20 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_\- ]+$/.test(newUsername)) {
      return NextResponse.json(
        { error: "Only letters, numbers, spaces, underscores, and hyphens are permitted." },
        { status: 400 }
      );
    }

    // Retrieve last changed timestamp from database / auth record
    let lastChangedAt = user.user_metadata?.username_changed_at || null;

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username_changed_at")
        .eq("id", user.id)
        .single();

      if (profile?.username_changed_at) {
        lastChangedAt = profile.username_changed_at;
      }
    } catch {
      // Profiles table query fallback
    }

    // Enforce 7-day rule on server
    const cooldown = calculateCooldown(lastChangedAt);
    if (!cooldown.canChange) {
      const daysText = cooldown.daysRemaining === 1 ? "1 day" : `${cooldown.daysRemaining} days`;
      return NextResponse.json(
        {
          error: `Username can be changed again in ${daysText}.`,
          can_change: false,
          days_remaining: cooldown.daysRemaining,
          next_allowed_date: cooldown.nextAllowedDate?.toISOString(),
        },
        { status: 429 }
      );
    }

    const serverNow = new Date().toISOString();

    // 1. Dual-persistence: Update Supabase auth user metadata
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: {
        username: newUsername,
        username_changed_at: serverNow,
      },
    });

    if (updateAuthError) {
      console.error("Failed to update user auth metadata:", updateAuthError.message);
    }

    // 2. Dual-persistence: Update Supabase public.profiles table if present
    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: newUsername,
        username_changed_at: serverNow,
        updated_at: serverNow,
      });

      if (profileError) {
        console.warn("Could not save to Supabase profiles table directly:", profileError.message);
      }
    } catch (err) {
      console.warn("Supabase profiles table upsert error:", err);
    }

    return NextResponse.json({
      success: true,
      username: newUsername,
      username_changed_at: serverNow,
      message: "Username updated successfully.",
    });
  } catch (err: unknown) {
    console.error("Change username error:", err);
    const msg = err instanceof Error ? err.message : "Failed to change username";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
