import * as React from 'react'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NewPasswordForm } from '@/components/new-password-form'

export const metadata: Metadata = {
  title: 'New Password',
  description: '',
}

export default async function NewPasswordPage({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const referer = (await headers()).get('referer')
  const token_hash = searchParams?.token_hash?.toString()
  const code = searchParams?.code?.toString()

  if (!referer) redirect('/auth/forgot-password')
  else if (!referer.includes('/auth/verify-request')) redirect('/auth/forgot-password')
  else if (!token_hash || !code) redirect('/auth/forgot-password')
  else if (!token_hash?.length || !code?.length) redirect('/auth/forgot-password')

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
