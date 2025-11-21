import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/admin", "/restaurant"]

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value

  // Redirect unauthenticated users away from protected routes
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    if (!userId) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith("/auth/")) {
    if (userId && !request.nextUrl.pathname.includes("/auth/logout")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon|favicon).*)"],
}
