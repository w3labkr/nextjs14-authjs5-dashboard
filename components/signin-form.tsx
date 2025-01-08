'use client'

import { useState } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { toast } from 'sonner'
import dayjs from '@/lib/dayjs'

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

import { fetcher } from '@/lib/utils'
import type { SignInAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().max(255).email(),
  password: z.string().min(6).max(72),
})

type FormValues = z.infer<typeof FormSchema>

export function SignInForm() {
  const { data: session } = useSession()
  console.log(`session: ${session}`)

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

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      const signed = await signIn("credentials", { redirect: false }, values)
      // console.log(values)
      console.log(signed)

      // const {success, message, data: { user }} = await fetcher<SignInAPI>('/api/v1/signin', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: values?.email,
      //     password: values?.password
      //   }),
      // })

      // if (!success) throw new Error(message)
      // else if (!user) throw new Error(message)

      // console.log(user)

      // router.refresh()
      // router.replace('/dashboard')
    } catch (e: unknown) {
      const message = (e as Error)?.message
      console.log(message)
      // if (message.includes('email or password')) setError('root', { message })
      // else toast.error(message)
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
        {errors.root && <FormMessage>{errors?.root?.message}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Sign In</Button>
      </form>
    </Form>
  )
}
