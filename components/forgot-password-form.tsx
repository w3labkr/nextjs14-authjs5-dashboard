'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  email: z.string().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
    router.push('/auth/verify-code')
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email address below and we will send you a message to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoCapitalize="none" autoComplete="email" autoCorrect="off" placeholder="me@example.com" {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Send</Button>
          </form>
        </Form>
        <div className="mt-4 text-sm text-center">
          <ArrowLeft className="inline size-4 -ml-4" />
          {` Back to `}
          <Link href="/auth/signin" className="underline">
            sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
