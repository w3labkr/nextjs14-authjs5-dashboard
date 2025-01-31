import * as React from 'react'
import type { Metadata } from 'next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyRequestForm } from '@/components/verify-request-form'
import { ResendVerifyButton } from '@/components/resend-verify-button'

export const metadata: Metadata = {
  title: 'Verify Request',
  description: '',
}

export default async function VerifyRequestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyRequestForm />
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive the email? <ResendVerifyButton />
        </div>
      </CardContent>
    </Card>
  )
}
