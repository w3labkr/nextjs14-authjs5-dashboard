'use client'

import * as React from 'react'
import { xhr } from '@/lib/http'
import type { CSRFTokenAPI } from '@/types/api'

export function useCSRFToken() {
  const [csrfToken, setCsrfToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const {
          data: { token },
        } = await xhr.get<CSRFTokenAPI>('/api/auth/csrf-token')
        setCsrfToken(token)
      } catch (e: unknown) {
        // console.error((e as Error)?.message)
      }
    }
    fetchCsrfToken()
  }, [])

  return { csrfToken }
}
