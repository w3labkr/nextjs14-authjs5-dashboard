'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
  email: z.string().max(255).email(),
  password: z.string().min(6).max(72),
})

type FormValues = z.infer<typeof FormSchema>

export function SignInForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: FormValues) {
    const signed = await signIn("credentials", values)
    console.log(signed)
    // console.log(values)
    router.push('/dashboard')
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="mt-4 flex justify-between items-center">
              <FormLabel>Password</FormLabel>
              <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
              </div>
              <FormControl>
                <Input type="password" autoCapitalize="none" autoComplete="current-password" autoCorrect="off" placeholder="************" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
    </Form>
  )
}
