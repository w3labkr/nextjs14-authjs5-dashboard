import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: '',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-full items-center justify-center px-4">{children}</div>
}
