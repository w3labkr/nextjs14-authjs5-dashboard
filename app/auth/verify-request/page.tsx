import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyRequestForm } from '@/components/verify-request-form'
import { ResendVerifyButton } from '@/components/resend-verify-button'

export default async function VerifyRequestPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyRequestForm />
        <div className="mt-4 text-center text-sm">
          {`Didn't receive the email? `}
          <ResendVerifyButton />
        </div>
      </CardContent>
    </Card>
  )
}
