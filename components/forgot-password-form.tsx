'use client'

import { useState } from 'react'
import { useRouter } from "next/navigation"

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

const FormSchema = z.object({
  email: z.string().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })
  const { control, handleSubmit, setError, formState: { errors } } = form
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    console.log(values)
    router.push('/auth/verify-code')
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
        {errors?.root && <FormMessage>{errors?.root?.message}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Send</Button>
      </form>
    </Form>
  )
}
