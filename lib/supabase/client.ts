import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for Client Components (Browser context).
 * Uses publishable / anon key only. Never exposes service-role keys.
 */
export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseKey);
}
