import NextAuth from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import authConfig from './auth.config'

import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/prisma'

// Add your adapter and the jwt session strategy there.
// This is the auth.ts configuration file you will import from in the rest of your application, other than in the middleware.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: 'jwt', // "jwt" | "database"
    maxAge: 2592000, // 30 days
    updateAge: 86400, // 1 day
  },
  ...authConfig,
})
