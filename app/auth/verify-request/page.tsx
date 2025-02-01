import * as React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyCodeForm } from '@/components/verify-code-form'
import { ResendCodeButton } from '@/components/resend-code-button'

export const metadata: Metadata = {
  title: 'Verify Request',
  description: '',
}

export default async function VerifyRequestPage({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token_hash = searchParams?.token_hash?.toString()

  if (!token_hash) redirect('/auth/forgot-password')
  else if (!token_hash?.length) redirect('/auth/forgot-password')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCodeForm />
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive the email? <ResendCodeButton token_hash={token_hash} />
          <br />
          <br />
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
