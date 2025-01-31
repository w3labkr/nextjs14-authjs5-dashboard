import * as React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignInForm } from '@/components/signin-form'
import { SignInWithGoogle } from '@/components/signin-with-google'
import { SignOutButton } from '@/components/signout-button'

export const metadata: Metadata = {
  title: 'Sign In',
  description: '',
}

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
        <SignInWithGoogle />
        <SignOutButton variant="destructive" className="mt-4 w-full" />
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
