'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { xhr } from '@/lib/http'
import type { NewPasswordAPI } from '@/types/api'

export const newPasswordFormSchema = z
  .object({
    newPassword: z.string().min(6).max(72),
    confirmNewPassword: z.string().min(6).max(72),
    code: z.string().length(6),
    token_hash: z.string(),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
  })

type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>

// This can come from your database or API.
const defaultValues: NewPasswordFormValues = {
  newPassword: '',
  confirmNewPassword: '',
  code: '',
  token_hash: '',
}

export function NewPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues,
    values: {
      ...defaultValues,
      code: searchParams.get('code') ?? '',
      token_hash: searchParams.get('token_hash') ?? '',
    },
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: NewPasswordFormValues) {
    try {
      setIsSubmitting(true)

      const { success, message } = await xhr.post<NewPasswordAPI>('/api/auth/new-password', {
        body: JSON.stringify(values),
      })

      if (!success) throw new Error(message)

      toast.success('Your password has been changed.')

      router.replace('/auth/login')
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <FormField control={control} name="code" render={({ field }) => <input type="hidden" {...field} />} />
          <FormField control={control} name="token_hash" render={({ field }) => <input type="hidden" {...field} />} />
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
          {errors?.root ? <FormMessage>{errors?.root?.message}</FormMessage> : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
