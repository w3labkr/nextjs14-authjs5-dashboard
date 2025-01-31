'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signUpSchema } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { xhr } from '@/lib/utils'
import type { SignUpAPI } from '@/types/api'

export function SignUpForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      setIsSubmitting(true)

      const {
        message,
        data: { user },
      } = await xhr.post<SignUpAPI>('/api/auth/signup', {
        body: JSON.stringify(values),
      })

      if (!user) throw new Error(message)

      toast.success(message)

      router.refresh()
      router.replace('/auth/signin')
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (message.includes('already exists')) setError('email', { message })
      else toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="grid gap-2 space-y-0">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    placeholder="me@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2 space-y-0">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem className="grid gap-2 space-y-0">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    placeholder="************"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}
