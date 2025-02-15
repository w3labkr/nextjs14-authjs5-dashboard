import * as React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPasswordForm } from '@/components/new-password-form'

export default async function NewPasswordPage({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth()
  const referer = headers().get('referer')
  const token_hash = searchParams?.token_hash?.toString()

  if (session) redirect('/dashboard')
  else if (!referer) redirect('/auth/verify-request')
  else if (!referer.includes('/auth/verify-request')) redirect('/auth/verify-request')
  else if (!token_hash) redirect('/auth/verify-request')

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
          <Link href="/auth/login" className="underline underline-offset-4">
            sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
