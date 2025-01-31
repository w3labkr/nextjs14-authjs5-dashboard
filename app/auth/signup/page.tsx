import * as React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpForm } from '@/components/signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: '',
}

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <div className="mt-4 text-sm text-muted-foreground">
          By clicking sign up, you agree to our{' '}
          <Link href="#" className="text-black underline">
            Terms of Service
          </Link>
          {' and '}
          <Link href="#" className="text-black underline">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
