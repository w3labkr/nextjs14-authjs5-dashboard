'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { sidebarOptInFormSchema } from '@/schemas/dashboard'

import { toast } from 'sonner'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSidebar } from '@/components/custom-ui/sidebar'
import { cn } from '@/lib/utils'

type SidebarOptInFormValues = z.infer<typeof sidebarOptInFormSchema>

// This can come from your database or API.
const defaultValues: SidebarOptInFormValues = {
  email: '',
}

export function SidebarOptInForm() {
  const { open } = useSidebar()
  const form = useForm<SidebarOptInFormValues>({
    resolver: zodResolver(sidebarOptInFormSchema),
    defaultValues,
  })
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: SidebarOptInFormValues) {
    try {
      setIsSubmitting(true)
      // ...
    } catch (e: unknown) {
      const message = (e as Error)?.message
      if (message.includes('already exists')) setError('email', { message })
      else toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={cn('shadow-none', !open && 'hidden')}>
      <Form {...form}>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm">Subscribe to our newsletter</CardTitle>
            <CardDescription>Opt-in to receive updates and news about the sidebar.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 p-4">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      placeholder="me@example.com"
                      className="h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-sidebar-primary text-sidebar-primary-foreground shadow-none"
              size="sm"
              disabled={isSubmitting}
            >
              Subscribe
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}
