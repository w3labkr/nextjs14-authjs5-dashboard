import { redirect } from 'next/navigation'
import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/prisma'
import { authConfig } from './auth.config'
import qs from 'qs'

// Add your adapter and the jwt session strategy there.
// This is the auth.ts configuration file you will import from in the rest of your application, other than in the middleware.
export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update: update,
} = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.AUTH_SECRET,
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  session: {
    strategy: 'jwt', // "jwt" | "database"
    maxAge: 2592000, // 30 days
    updateAge: 86400, // 1 day
  },
  ...authConfig,
})

export function logOut(options?: { redirectTo?: string; redirect?: true }) {
  const search = qs.stringify(options, { encode: false, addQueryPrefix: true })
  redirect(`/api/auth/logout${search}`)
}
