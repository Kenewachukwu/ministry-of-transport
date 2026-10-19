import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth/config";
import { verifySessionToken } from "@/lib/auth/token";

/**
 * Optimistic gate for /admin: anyone without a validly SIGNED session cookie is
 * sent to the login page. It deliberately does no database work and is NOT the
 * security boundary — every admin page and Server Action re-checks the session
 * and the person's permissions itself (src/lib/auth/dal.ts).
 */
const PUBLIC_PATHS = [
  /^\/admin\/login$/,
  /^\/admin\/forgot-password$/,
  /^\/admin\/reset-password\/[^/]+$/,
  /^\/admin\/accept-invite\/[^/]+$/,
  /^\/admin\/sign-in-help$/, // static help for people who cannot sign in yet
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.some((pattern) => pattern.test(pathname))) return NextResponse.next();

  const token = request.cookies.get(sessionCookieName())?.value;
  if (token && (await verifySessionToken(token))) return NextResponse.next();

  const login = new URL("/admin/login", request.url);
  // Only ever a local /admin path, so the login page can't be used as an open redirect.
  login.searchParams.set("next", pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*"],
};
