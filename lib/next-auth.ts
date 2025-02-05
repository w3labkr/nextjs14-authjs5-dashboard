import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import qs from 'qs'

export function logOut(options?: { redirectTo?: string; redirect?: true }) {
  const search = qs.stringify(options, { encode: false, addQueryPrefix: true })
  redirect(`/api/auth/logout${search}`)
}

export function getCsrfToken() {
  return cookies().get('authjs.csrf-token')?.value?.split('|')[0]
}

export function verifyCsrfToken({ req, authorization }: { req: NextRequest; authorization: string | null }) {
  const token = req.cookies.get('authjs.csrf-token')?.value?.split('|')[0]
  return authorization === `Bearer ${token}`
}
