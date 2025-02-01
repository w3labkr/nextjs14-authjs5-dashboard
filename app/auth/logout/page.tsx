import * as React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/logout-button'

export const metadata: Metadata = {
  title: 'Logout',
  description: '',
}

export default async function LogoutPage() {
  const session = await auth()

  if (!session) redirect('/auth/login')

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
