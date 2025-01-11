import * as React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: '',
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
