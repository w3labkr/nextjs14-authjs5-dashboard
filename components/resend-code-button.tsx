'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { xhr } from '@/lib/http'
import type { ForgotPasswordAPI } from '@/types/api'
import { decodeJwt, isTokenExpired, type Token } from '@/lib/jose'

const ResendCodeButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token_hash = searchParams.get('token_hash')
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

    const handleSubmit = async () => {
      try {
        setIsSubmitting(true)

        if (!token_hash) throw new Error('Missing token_hash')

        const token = decodeJwt<Token>(token_hash)

        // Tokens can be reissued 1 minute after issuance.
        if (!token?.iat) throw new Error('Invalid Token')
        else if (!isTokenExpired(token.iat, { expiresIn: 60 })) throw new Error('Please try again in 1 minute.')

        const {
          message,
          data: { token: newToken },
        } = await xhr.post<ForgotPasswordAPI>('/api/auth/forgot-password', {
          body: JSON.stringify({ email: token.sub }),
        })

        if (!newToken) throw new Error(message)

        toast.success('Your email has been sent.')

        router.push(`/auth/verify-request?token_hash=${newToken}`)
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
