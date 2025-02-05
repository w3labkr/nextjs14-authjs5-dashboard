import * as React from 'react'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { ClientAuthProvider, NotAuthenticated, TokenExpired } from '@/context/auth-provider'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: '',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) return <NotAuthenticated />
  else if (session?.error) return <TokenExpired />

  return <ClientAuthProvider>{children}</ClientAuthProvider>
}
