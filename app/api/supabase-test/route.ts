import { NextResponse } from "next/server";
import { testSupabaseConnection } from "@/lib/supabase/testConnection";

export const dynamic = "force-dynamic";

/**
 * Minimal Supabase connection verification endpoint.
 * Does not alter or expose any UI or credentials.
 */
export async function GET() {
  const result = await testSupabaseConnection();
  return NextResponse.json(result);
}
