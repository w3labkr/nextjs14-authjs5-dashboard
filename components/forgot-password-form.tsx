'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { forgotPasswordSchema } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { xhr } from '@/lib/utils'
import type { ForgotPasswordAPI } from '@/types/api'

export function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      setIsSubmitting(true)

      const {
        message,
        data: { token_hash },
      } = await xhr.post<ForgotPasswordAPI>('/api/auth/forgot-password', {
        body: JSON.stringify(values),
      })

      if (!token_hash) throw new Error(message)

      router.push(`/auth/verify-request?token_hash=${token_hash}`)
    } catch (e: unknown) {
      toast.error('Something went wrong.')
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
                <Input
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  placeholder="me@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Send
        </Button>
      </form>
    </Form>
  )
}
