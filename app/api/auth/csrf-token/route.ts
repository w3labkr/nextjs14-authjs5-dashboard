import { NextResponse, type NextRequest } from 'next/server'
import { STATUS_CODES } from '@/lib/http'
import { generateCsrfToken, verifyAjax } from '@/lib/crypto'

export async function GET(req: NextRequest) {
  const token = generateCsrfToken()

  if (!verifyAjax(req)) {
    return new NextResponse('Invalid or missing X-Requested-With header', { status: STATUS_CODES.UNAUTHORIZED })
  }

  // Set CSRF token as an HTTP-only cookie
  const response = new NextResponse(token)
  response.cookies.set('_self.csrf-token', token, { httpOnly: true, secure: true, sameSite: 'strict' })

  return response
}
