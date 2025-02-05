'use client'

import * as React from 'react'
import { SessionProvider, signOut, useSession } from 'next-auth/react'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Re-fetch session every 5 minutes
  return <SessionProvider refetchInterval={60 * 5}>{children}</SessionProvider>
}

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: session, status } = useSession({ required: true })

  if (status === 'authenticated' && session?.error) window.location.reload()

  return <>{children}</>
}

export function NotAuthenticated() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Not authenticated</AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export function TokenExpired() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
        <br />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => signOut({ redirectTo: '/auth/login' })}
          className="w-full"
        >
          OK
        </Button>
      </div>
    </div>
  )
}
