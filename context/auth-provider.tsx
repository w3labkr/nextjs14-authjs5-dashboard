'use client'

import * as React from 'react'
import { SessionProvider, signOut, useSession } from 'next-auth/react'

import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export function ClientAuthProvider({
  children,
  refetchInterval = 1000 * 60 * 5, // Re-fetch session every 5 minutes
}: {
  children: React.ReactNode
  refetchInterval?: number
}) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: session, status, update } = useSession({ required: true })

  // Polling the session
  React.useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), refetchInterval)
    return () => clearInterval(interval)
  }, [update])

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  React.useEffect(() => {
    const visibilityHandler = () => document.visibilityState === 'visible' && update()
    window.addEventListener('visibilitychange', visibilityHandler, false)
    return () => window.removeEventListener('visibilitychange', visibilityHandler, false)
  }, [update])

  if (status === 'authenticated' && session?.error) window.location.reload()

  return <>{children}</>
}

export function NotAuthenticated() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Alert variant="destructive">
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
        <Alert variant="destructive">
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
