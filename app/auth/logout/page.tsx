import * as React from 'react'
import type { Metadata } from 'next'
import { auth } from '@/auth'
import { NotAuthenticated, TokenExpired } from '@/context/auth-provider'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/logout-button'

export const metadata: Metadata = {
  title: 'Logout',
  description: '',
}

export default async function LogoutPage() {
  const session = await auth()

  if (!session) return <NotAuthenticated />
  else if (session?.error) return <TokenExpired />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Logout</CardTitle>
        <CardDescription>Are you sure you want to sign out?</CardDescription>
      </CardHeader>
      <CardContent>
        <LogoutButton className="w-full" />
      </CardContent>
    </Card>
  )
}
