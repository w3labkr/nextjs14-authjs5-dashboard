'use client'

import * as React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const SignOutButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  return (
    <Button ref={ref} onClick={() => signOut({ redirectTo: '/auth/signin' })} {...props}>
      Sign out
    </Button>
  )
})
SignOutButton.displayName = 'SignOutButton'

export { SignOutButton }
