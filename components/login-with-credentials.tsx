'use client'

import * as React from 'react'
import { signIn, type SignInOptions } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface LoginWithCredentialsProps extends React.ComponentProps<typeof Button> {
  options?: SignInOptions
}

const LoginWithCredentials = React.forwardRef<HTMLButtonElement, LoginWithCredentialsProps>(
  ({ options, ...props }, ref) => {
    return (
      <Button ref={ref} onClick={() => signIn('credentials', { redirectTo: '/dashboard', ...options })} {...props}>
        Login with Google
      </Button>
    )
  }
)
LoginWithCredentials.displayName = 'LoginWithCredentials'

export { LoginWithCredentials }
