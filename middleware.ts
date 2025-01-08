import { type NextRequest } from 'next/server'
import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
  const url = new URL(req.url)
  req.headers.set('x-url', req.url)
  req.headers.set('x-origin', url.origin)
  req.headers.set('x-pathname', url.pathname)
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
