'use client'

import * as React from 'react'
import { absoluteUrl } from '@/lib/utils'

export function useCSRFToken() {
  const [csrfToken, setCsrfToken] = React.useState<string>('missing')

  React.useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(absoluteUrl('/api/auth/csrf-token'), {
          method: 'GET',
          headers: { 'Content-Type': 'text/plain' },
        })
        const token = await res.text()
        if (!res.ok) throw new Error(res.statusText)
        setCsrfToken(token)
      } catch (e: unknown) {
        // console.error((e as Error)?.message)
      }
    }
    fetchCsrfToken()
  }, [])

  return csrfToken
}
