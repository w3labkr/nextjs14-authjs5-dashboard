import * as React from 'react'
import type { Metadata } from 'next'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: '',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) return <div>Not authenticated</div>

  return <>{children}</>
}
