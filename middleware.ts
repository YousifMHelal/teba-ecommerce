import { authEdge } from "@/lib/auth-edge"
import { NextResponse } from "next/server"

export default authEdge((req) => {
  const { nextUrl, auth: session } = req

  const isLoggedIn = !!session?.user
  const isAdmin = session?.user?.role === "ADMIN"

  const pathname = nextUrl.pathname

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if (
    pathname.startsWith("/checkout") &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${pathname}`, nextUrl)
    )
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/checkout/:path*", "/admin/:path*", "/login", "/register"],
}
