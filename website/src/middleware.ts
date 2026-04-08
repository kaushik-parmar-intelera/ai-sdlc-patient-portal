import { NextRequest, NextResponse } from "next/server";

import { getAuthRedirectPath, isAuthorizedForPath } from "@/lib/auth/route-guard";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth_session");
  const pathname = request.nextUrl.pathname;

  if (!isAuthorizedForPath({ pathname, isAuthenticated })) {
    const redirectPath = getAuthRedirectPath(pathname);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/private/:path*"],
};
