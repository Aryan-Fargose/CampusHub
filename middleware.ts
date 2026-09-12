import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run Supabase session cookie update
  const response = await updateSession(request);

  // Check guest and auth cookies
  const isGuest = request.cookies.get("campushub_guest")?.value === "true";
  const hasAuth = request.cookies.get("campushub_auth")?.value === "true";

  // Also check for Supabase auth cookie presence (names begin with "sb-")
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  const hasActiveSession = isGuest || hasAuth || hasSupabaseCookie;

  // If visiting "/" without any session, redirect to the initial entry screen "/auth"
  if (pathname === "/" && !hasActiveSession) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = "/auth";
    return NextResponse.redirect(authUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
