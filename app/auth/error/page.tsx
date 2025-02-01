import * as React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Auth Error',
  description: '',
}

export default function AuthErrorPage({
  params,
  searchParams,
}: {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const error = searchParams?.error?.toString() || 'unknown'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        There was a problem when trying to authenticate. Please contact us if this error persists. Unique error code:{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">{error}</code>
        <br />
        <br />
        <Link href="/auth/login" className="underline underline-offset-4">
          sign in
        </Link>
      </CardContent>
    </Card>
  )
}
