'use client'

import * as React from 'react'
import { signIn, type SignInOptions } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface LoginWithGoogleProps extends React.ComponentProps<typeof Button> {
  options?: SignInOptions
}

const LoginWithGoogle = React.forwardRef<HTMLButtonElement, LoginWithGoogleProps>(({ options, ...props }, ref) => {
  return (
    <Button ref={ref} onClick={() => signIn('google', { redirectTo: '/dashboard', ...options })} {...props}>
      Login with Google
    </Button>
  )
})
LoginWithGoogle.displayName = 'LoginWithGoogle'

export { LoginWithGoogle }
