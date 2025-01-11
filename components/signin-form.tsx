'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { toast } from 'sonner'

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
  const { control, handleSubmit, setError, formState: { errors } } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // temp
  const { data: session } = useSession()

  useEffect(() => {
    if (session) console.log(session)
  }, [session])

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      const res = await signIn('credentials', { ...values, redirect: false })
      console.log(res)

      if (res?.error) throw Error(res?.code)

      // router.refresh()
      // router.replace('/dashboard')
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (message.includes('Invalid identifier or password')) setError('root', { message })
      else toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
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
          control={control}
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
        {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Sign In</Button>
      </form>
    </Form>
  )
}
