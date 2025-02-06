'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { getCsrfToken } from 'next-auth/react'
import { toast } from 'sonner'

import { xhr } from '@/lib/http'
import type { ForgotPasswordAPI } from '@/types/api'
import { decodeJwt, type Token } from '@/lib/jose'

interface ResendCodeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  token_hash: string
}

const ResendCodeButton = React.forwardRef<HTMLButtonElement, ResendCodeButtonProps>(({ token_hash, ...props }, ref) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const decoded = decodeJwt<Token>(token_hash)
      const retry = 60 // (seconds) 1 minute

      // Tokens can be reissued 1 minute after issuance.
      if (Date.now() < (decoded.iat + retry) * 1000) {
        throw new Error('Please try again in 1 minute.')
      }

      const csrfToken = await getCsrfToken()
      const {
        message,
        data: { token },
      } = await xhr.post<ForgotPasswordAPI>('/api/auth/forgot-password', {
        headers: { Authorization: `Bearer ${csrfToken}` },
        body: JSON.stringify({ email: decoded.sub }),
      })

      if (!token) throw new Error(message)

      toast.success('Your email has been sent.')

      router.push(`/auth/verify-request?token_hash=${token}`)
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
})
ResendCodeButton.displayName = 'ResendCodeButton'

export { ResendCodeButton }
