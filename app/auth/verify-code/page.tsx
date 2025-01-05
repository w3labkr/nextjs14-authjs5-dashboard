import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VerifyCodeForm } from "@/components/verify-code-form"

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>Please enter the 6-digit code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyCodeForm />
          <div className="mt-4 text-sm text-center">
            {`Didn't receive the email? `}
            <Link href="/auth/signin" className="underline">
              Click to resend
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
