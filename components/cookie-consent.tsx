'use client'

import * as React from 'react'

import { CookieIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

export function CookieConsent() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [isHide, setIsHide] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (document.cookie.includes('cookieConsent=true')) {
      setIsOpen(false)
      setTimeout(() => setIsHide(true), 700)
    } else {
      setIsOpen(true)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[200] w-full duration-700 sm:bottom-4 sm:left-4 sm:max-w-md',
        !isOpen
          ? 'translate-y-8 opacity-0 transition-[opacity,transform]'
          : 'translate-y-0 opacity-100 transition-[opacity,transform]',
        isHide && 'hidden'
      )}
    >
      <div className="m-3 rounded-lg border border-border bg-background dark:bg-card">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-lg font-bold">We use cookies</h1>
          <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
        </div>
        <div className="-mt-2 p-3">
          <p className="text-left text-sm text-muted-foreground">
            We use cookies to ensure you get the best experience on our website. For more information on how we use
            cookies, please see our cookie policy.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 border-t p-3">
          <Button
            onClick={() => {
              setIsOpen(false)
              document.cookie = 'cookieConsent=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              setTimeout(() => setIsHide(true), 700)
            }}
            className="h-9 w-full rounded-full"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false)
              setTimeout(() => setIsHide(true), 700)
            }}
            className="h-9 w-full rounded-full"
            variant="outline"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  )
}
