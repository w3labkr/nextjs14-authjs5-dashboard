import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Code',
  description: '',
}

export default function VerifyCodeLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-full items-center justify-center px-4">{children}</div>
}
