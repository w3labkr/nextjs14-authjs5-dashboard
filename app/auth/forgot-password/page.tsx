import * as React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from '@/components/forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: '',
}

export default async function ForgotPasswordPage() {
  const session = await auth()

  if (session) redirect('/dashboard')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email address below and we will send you a message to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
        <div className="mt-4 text-center text-sm">
          <ArrowLeft className="-ml-4 inline size-4" />
          {` Back to `}
          <Link href="/auth/login" className="underline underline-offset-4">
            sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
