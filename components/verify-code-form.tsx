'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { verifyCodeFormSchema } from '@/schemas/auth'

import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Button } from '@/components/ui/button'

import { decodeJwt, isTokenExpired, type Token } from '@/lib/jwt'
import { compareHash } from '@/lib/bcrypt'

type VerifyCodeFormValues = z.infer<typeof verifyCodeFormSchema>

// This can come from your database or API.
const defaultValues: VerifyCodeFormValues = {
  code: '',
}

export function VerifyCodeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<VerifyCodeFormValues>({
    resolver: zodResolver(verifyCodeFormSchema),
    defaultValues,
    values: {
      ...defaultValues,
    },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: VerifyCodeFormValues) {
    try {
      setIsSubmitting(true)

      const token_hash = searchParams.get('token_hash')
      if (!token_hash) throw new Error('token_hash missing or incorrect')
      const token = decodeJwt<Token>(token_hash)

      if (isTokenExpired(token?.exp)) throw new Error('Invalid or expired token')
      else if (!(await compareHash(values?.code, token.code))) {
        throw new Error('Invalid code')
      }

      router.push(`/auth/new-password?token_hash=${token_hash}`)
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
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
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
          {errors?.root ? <FormMessage>{errors?.root?.message}</FormMessage> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Verify
          </Button>
        </div>
      </form>
    </Form>
  )
}
