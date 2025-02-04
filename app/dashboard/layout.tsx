import * as React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth, logOut } from '@/auth'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: '',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect('/auth/login')
  if (session?.error) logOut({ redirectTo: '/auth/login' })

  return <>{children}</>
}
