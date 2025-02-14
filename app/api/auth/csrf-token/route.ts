import { NextResponse, type NextRequest } from 'next/server'
import { generateCsrfToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  const token = await generateCsrfToken()

  // Set CSRF token as an HTTP-only cookie
  const response = new NextResponse(token)
  response.cookies.set('_self.csrf-token', token, { path: '/', httpOnly: true, secure: true, sameSite: 'strict' })

  return response
}
