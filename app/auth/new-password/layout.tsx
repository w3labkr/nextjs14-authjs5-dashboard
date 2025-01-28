import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Password',
  description: '',
}

export default function NewPasswordLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-full items-center justify-center px-4">{children}</div>
}
