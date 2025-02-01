'use client'

import * as React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const LogoutButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>((props, ref) => {
  return (
    <Button ref={ref} onClick={() => signOut({ redirectTo: '/auth/login' })} {...props}>
      Sign out
    </Button>
  )
})
LogoutButton.displayName = 'LogoutButton'

export { LogoutButton }
