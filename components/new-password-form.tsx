'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { newPasswordSchema } from '@/schemas/auth'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { xhr } from '@/lib/utils'
import type { NewPasswordAPI } from '@/types/api'

export function NewPasswordForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
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

  async function onSubmit(values: z.infer<typeof newPasswordSchema>) {
    try {
      setIsSubmitting(true)

      console.log(values)

      const { success, message } = await xhr.post<NewPasswordAPI>('/api/auth/forgot-password', {
        body: JSON.stringify(values),
      })

      if (!success) throw new Error(message)

      // router.replace('/auth/signin')
    } catch (e: unknown) {
      toast.error('Something went wrong.')
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
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
