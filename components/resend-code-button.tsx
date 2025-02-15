'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import type { ForgotPasswordAPI } from '@/types/api'
import { decodeJwt, isTokenExpired, type Token } from '@/lib/jwt'
import { useCsrfToken } from '@/hooks/use-csrf-token'
import { absoluteUrl } from '@/lib/utils'

const ResendCodeButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
    const csrfToken = useCsrfToken()

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true)

        const token_hash = searchParams.get('token_hash')
        if (!token_hash) throw new Error('token_hash missing or incorrect')
        const token = decodeJwt<Token>(token_hash)

        // Tokens can be reissued 1 minute after issuance.
        if (!token?.iat) throw new Error('token_hash missing or incorrect')
        else if (!isTokenExpired(token.iat, { expiresIn: 60 })) {
          throw new Error('Please try again in 1 minute.')
        }

        const res = await fetch(absoluteUrl('/api/auth/forgot-password'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ email: token.sub }),
        })
        const { success, message, data }: ForgotPasswordAPI = await res.json()

        if (!success || !data.token) throw new Error(message)

        toast.success(message)

        router.push(`/auth/verify-request?token_hash=${data.token}`)
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <button ref={ref} onClick={handleSubmit} disabled={isSubmitting} {...props}>
        Click to resend
      </button>
    )
  }
)
ResendCodeButton.displayName = 'ResendCodeButton'

export { ResendCodeButton }
