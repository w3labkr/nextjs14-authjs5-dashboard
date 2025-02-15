'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { forgotPasswordFormSchema } from '@/schemas/auth'
import { useCsrfToken } from '@/hooks/use-csrf-token'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { absoluteUrl } from '@/lib/utils'
import type { ForgotPasswordAPI } from '@/types/api'

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

// This can come from your database or API.
const defaultValues: ForgotPasswordFormValues = {
  email: '',
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues,
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const csrfToken = useCsrfToken()

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setIsSubmitting(true)

      const res = await fetch(absoluteUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(values),
      })
      const { success, message, data }: ForgotPasswordAPI = await res.json()

      if (!success || !data.token) throw new Error(message)

      toast.success(message)

      router.push(`/auth/verify-request?token_hash=${data.token}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
          {errors?.root ? <FormMessage>{errors?.root?.message}</FormMessage> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Send
          </Button>
        </div>
      </form>
    </Form>
  )
}
