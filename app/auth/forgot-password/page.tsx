import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email address below and we will send you a message to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-4 text-sm text-center">
            <ArrowLeft className="inline size-4 -ml-4" />
            {` Back to `}
            <Link href="/auth/signin" className="underline">
              sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
