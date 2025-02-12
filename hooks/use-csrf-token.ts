'use client'

import * as React from 'react'
import type { CSRFTokenAPI } from '@/types/api'
import { absoluteUrl } from '@/lib/utils'

export function useCSRFToken() {
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(absoluteUrl('/api/auth/csrf-token'), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const result: CSRFTokenAPI = await res.json()

        if (!res.ok) throw new Error(res.statusText)
        if (!result.data.token) throw new Error(result.message)

        setCsrfToken(result.data.token)
      } catch (e: unknown) {
        console.error((e as Error)?.message)
      }
    }
    fetchCsrfToken()
  }, [])

  return { csrfToken }
}
