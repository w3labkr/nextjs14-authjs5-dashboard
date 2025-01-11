'use client'

import { useState } from 'react'
import { useRouter } from "next/navigation"
import { toast } from 'sonner'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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

import { fetcher } from "@/lib/utils"
import type { SignUpAPI } from '@/types/api'

const FormSchema = z
  .object({
    email: z.string().min(4).max(255).email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    newPassword: z.string().min(6).max(72),
    confirmNewPassword: z.string().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
  })

type FormValues = z.infer<typeof FormSchema>

export function SignUpForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  })
  const { control, handleSubmit, setError, formState: { errors } } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)

      const {success, message, data: { user }} = await fetcher<SignUpAPI>('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values?.email,
          password: values?.newPassword
        }),
      })

      if (!success) throw new Error(message)
      else if (!user) throw new Error(message)

      toast.success('You have successfully registered as a member.')

      router.refresh()
      router.replace('/auth/signin')
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (message.includes('registered')) setError('email', { message })
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
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoCapitalize="none" autoComplete="new-password" autoCorrect="off" placeholder="************" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" autoCapitalize="none" autoComplete="new-password" autoCorrect="off" placeholder="************" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Sign Up</Button>
      </form>
    </Form>
  )
}
