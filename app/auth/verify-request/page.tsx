import * as React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyCodeForm } from '@/components/verify-code-form'
import { ResendCodeButton } from '@/components/resend-code-button'

export default async function VerifyRequestPage({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth()
  const token_hash = searchParams?.token_hash?.toString()

  if (session) redirect('/dashboard')
  else if (!token_hash) redirect('/auth/forgot-password')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCodeForm />
        <div className="mt-4 text-center text-sm">
          Didn&apos;t receive the email? <ResendCodeButton type="button" className="underline underline-offset-4" />
          <br />
          <br />
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
