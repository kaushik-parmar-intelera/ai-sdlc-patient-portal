import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PATHS = [
  "/dashboard",
  "/profile",
  "/appointments",
  "/messages",
  "/prescriptions",
  "/lab-results",
];

const PUBLIC_AUTH_PATHS = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("auth_session");

  const isPrivate = PRIVATE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isPublicAuth = PUBLIC_AUTH_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Unauthenticated users trying to access private routes → send to login
  if (isPrivate && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already-authenticated users trying to access login/register → send to dashboard
  if (isPublicAuth && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/appointments",
    "/appointments/:path*",
    "/messages",
    "/messages/:path*",
    "/prescriptions",
    "/prescriptions/:path*",
    "/lab-results",
    "/lab-results/:path*",
    "/login",
    "/register",
  ],
};
