import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth',
  description: '',
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
