import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl, auth: session } = req

  const isLoggedIn = !!session?.user
  const isAdmin = session?.user?.role === "ADMIN"

  const isAccountRoute =
    nextUrl.pathname.startsWith("/profile") || nextUrl.pathname.startsWith("/orders") || nextUrl.pathname.startsWith("/addresses") || nextUrl.pathname.startsWith("/checkout")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // Redirect unauthenticated users away from protected routes
  if (isAccountRoute && !isLoggedIn) {


    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${nextUrl.pathname}${nextUrl.search}`, nextUrl),
    )
  }

  // Redirect non-admin users away from admin routes
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
}
