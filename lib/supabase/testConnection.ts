import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface SupabaseConnectionStatus {
  connected: boolean;
  urlConfigured: boolean;
  keyConfigured: boolean;
  latencyMs?: number;
  message: string;
  error?: string;
}

/**
 * Tests connection to the configured Supabase project.
 * Performs a lightweight auth ping without exposing credentials or modifying any data.
 */
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const urlConfigured = Boolean(supabaseUrl && supabaseUrl.trim().length > 0);
  const keyConfigured = Boolean(supabaseKey && supabaseKey.trim().length > 0);

  if (!urlConfigured || !keyConfigured) {
    return {
      connected: false,
      urlConfigured,
      keyConfigured,
      message:
        "Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set in .env.local",
    };
  }

  const startTime = Date.now();
  try {
    const client = createSupabaseClient(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Minimal lightweight ping: fetch current auth session or settings
    const { error } = await client.auth.getSession();
    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        connected: false,
        urlConfigured: true,
        keyConfigured: true,
        latencyMs,
        message: "Failed to connect to Supabase service.",
        error: error.message,
      };
    }

    return {
      connected: true,
      urlConfigured: true,
      keyConfigured: true,
      latencyMs,
      message: "Successfully connected to Supabase project.",
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      urlConfigured: true,
      keyConfigured: true,
      latencyMs,
      message: "Network or runtime error while contacting Supabase.",
      error: errorMessage,
    };
  }
}
