import { NextResponse, type NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req) {
  const res = NextResponse.next({ request: { headers: req.headers } })

  res.headers.set('x-url', req.nextUrl.href)
  res.headers.set('x-origin', req.nextUrl.origin)
  res.headers.set('x-pathname', req.nextUrl.pathname)

  return res
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
