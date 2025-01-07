import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { NewPasswordForm } from "@/components/new-password-form"

export default function NewPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPasswordForm />
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
