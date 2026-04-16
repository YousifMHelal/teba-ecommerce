import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "ADMIN";

  const isAccountRoute =
    nextUrl.pathname.startsWith("/profile") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/addresses") ||
    nextUrl.pathname.startsWith("/checkout");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users away from protected routes
  if (isAccountRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${nextUrl.pathname}${nextUrl.search}`, nextUrl)
    );
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/orders/:path*",
    "/addresses/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
