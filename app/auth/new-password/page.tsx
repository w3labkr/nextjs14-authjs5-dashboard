import * as React from 'react'
import type { Metadata } from 'next'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPasswordForm } from '@/components/new-password-form'

export const metadata: Metadata = {
  title: 'New Password',
  description: '',
}

export default function NewPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Set new password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <NewPasswordForm />
        <div className="mt-4 text-center text-sm">
          <ArrowLeft className="-ml-4 inline size-4" />
          {` Back to `}
          <Link href="/auth/signin" className="underline">
            sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
