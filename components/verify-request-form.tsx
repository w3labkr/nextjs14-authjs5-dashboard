'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { verifyRequestSchema } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

import { xhr } from '@/lib/utils'
import type { VerifyRequestAPI } from '@/types/api'

const defaultValues = {
  code: '',
  token_hash: '',
}

export function VerifyRequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token_hash = searchParams.get('token_hash') ?? ''

  const form = useForm<z.infer<typeof verifyRequestSchema>>({
    resolver: zodResolver(verifyRequestSchema),
    defaultValues,
    values: { ...defaultValues, token_hash },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit(values: z.infer<typeof verifyRequestSchema>) {
    try {
      setIsSubmitting(true)

      const { success, message } = await xhr.post<VerifyRequestAPI>('/api/auth/verify-request', {
        body: JSON.stringify(values),
      })

      if (!success) throw new Error(message)

      router.push('/auth/new-password')
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (message.includes('Invalid code')) setError('code', { message })
      else toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField control={control} name="token_hash" render={({ field }) => <input type="hidden" {...field} />} />
          <FormField
            control={control}
            name="code"
            render={({ field }) => (
              <FormItem className="grid gap-2 space-y-0">
                <FormLabel>Digit Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Verify
          </Button>
        </div>
      </form>
    </Form>
  )
}
