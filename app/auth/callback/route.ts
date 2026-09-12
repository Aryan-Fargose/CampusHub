import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const origin = requestUrl.origin;

  if (error) {
    console.error("OAuth error received in callback:", error, errorDescription);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", errorDescription || error);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError && data?.user) {
      let hasUsername = false;

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", data.user.id)
          .single();

        if (profile?.username && profile.username.trim().length > 0) {
          hasUsername = true;
        }
      } catch {
        // Fallback if profile row is not yet created
      }

      if (!hasUsername && data.user.user_metadata?.username) {
        hasUsername = true;
      }

      const targetPath = hasUsername ? "/" : "/onboarding/username";
      const redirectResponse = NextResponse.redirect(new URL(targetPath, origin));

      // Ensure session cookies are recognized by proxy and client
      redirectResponse.cookies.set("campushub_auth", "true", {
        path: "/",
        maxAge: 604800,
        sameSite: "lax",
      });
      redirectResponse.cookies.set("campushub_guest", "", {
        path: "/",
        maxAge: 0,
      });

      return redirectResponse;
    } else if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError.message);
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("error", exchangeError.message);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}
