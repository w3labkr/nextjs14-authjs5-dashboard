import { headers } from 'next/headers'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyCodeForm } from '@/components/verify-code-form'

export default async function VerifyCodePage() {
  const headersList = await headers()
  const referer = headersList.get('referer')

  // { referer: 'http://localhost:3000/auth/verify-code' }
  // console.log({ referer })

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCodeForm referer={referer} />
        <div className="mt-4 text-center text-sm">
          {`Didn't receive the email? `}
          <Link href="/auth/signin" className="underline">
            Click to resend
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
