"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button type="button" variant="outline" className="w-full mt-4" onClick={() => signOut({ redirectTo: '/auth/signin' })}>
      Sign out
    </Button>
  )
}
