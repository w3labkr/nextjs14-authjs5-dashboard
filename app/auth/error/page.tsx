import * as React from 'react'
import type { Metadata } from 'next'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        There was a problem when trying to authenticate. Please contact us if this error persists. Unique error code:{' '}
        <code className="rounded-sm bg-slate-100 p-1 text-xs">{error}</code>
      </AlertDescription>
    </Alert>
  )
}
