'use client'

import Link from "next/link"
import { signIn } from "next-auth/react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

export function SignInWithCredentials() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // const credentialsAction = (formData: any) => {
  //   console.log(formData)
  //   // const signed = signIn("credentials", formData)
  //   // console.log(signed)
  // }
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="credentials-email">Email</Label>
          <Input
            id="credentials-email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="credentials-password">Password</Label>
            <Link href="/auth/forgot-password" className="ml-auto inline-block text-sm underline">
              Forgot your password?
            </Link>
          </div>
          <Input id="credentials-password" name="password" type="password" placeholder="************" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </Form>
  )
}
