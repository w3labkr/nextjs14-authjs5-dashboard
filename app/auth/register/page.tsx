import * as React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/register-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: '',
}

export default async function RegisterPage() {
  const session = await auth()

  if (session) redirect('/dashboard')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
        <div className="mt-4 text-sm text-muted-foreground">
          By clicking sign up, you agree to our{' '}
          <Link href="#" className="text-black underline underline-offset-4">
            Terms of Service
          </Link>
          {' and '}
          <Link href="#" className="text-black underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
