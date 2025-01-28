import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUpForm } from '@/components/signup-form'

export default function SignUpPage() {
  return (
    <Card className="mx-auto max-w-sm">
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
        <div className="mt-4 text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
