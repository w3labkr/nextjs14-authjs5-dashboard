import * as React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/login-form'
import { LoginWithGoogle } from '@/components/login-with-google'

export default async function LoginPage() {
  const session = await auth()

  if (session) redirect('/dashboard')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <LoginWithGoogle type="button" variant="outline" className="mt-4 w-full" />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
