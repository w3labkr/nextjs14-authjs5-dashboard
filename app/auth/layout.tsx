import * as React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Auth',
  description: '',
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (session) redirect('/dashboard')

  return <>{children}</>
}
