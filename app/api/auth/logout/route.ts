import { NextResponse, type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'

export const GET = auth(async function GET(req) {
  if (!req.auth) redirect('/auth/login')

  const searchParams = req.nextUrl.searchParams
  const options = {
    redirectTo: searchParams.get('redirectTo') ?? undefined,
    redirect: searchParams.get('redirect') === 'true' ? true : undefined,
  }

  return await signOut({ ...options })
})
