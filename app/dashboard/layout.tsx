import * as React from 'react'
import { auth } from '@/auth'
import { ClientAuthProvider, NotAuthenticated, TokenExpired } from '@/context/next-auth-provider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) return <NotAuthenticated />
  else if (session?.error) return <TokenExpired />

  return <ClientAuthProvider>{children}</ClientAuthProvider>
}
