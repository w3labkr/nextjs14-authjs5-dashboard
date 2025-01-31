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

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}
