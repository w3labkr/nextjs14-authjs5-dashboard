'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function SignInWithGoogle() {
  return (
    <Button
      type="button"
      variant="outline"
      className="mt-4 w-full"
      onClick={() => signIn('google', { redirectTo: '/dashboard' })}
    >
      Signin with Google
    </Button>
  )
}
