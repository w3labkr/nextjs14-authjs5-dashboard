'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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

      const token = decodeJwt<Token>(token_hash)
      const retry = 60 // 60s

      // Tokens can be reissued 1 minute after issuance.
      if (Date.now() < (token.iat + retry) * 1000) throw new Error('Please try again in 1 minute.')

      const { message, data } = await xhr.post<ForgotPasswordAPI>('/api/auth/forgot-password', {
        body: JSON.stringify({ email: token.sub }),
      })

      if (!data?.token_hash) throw new Error(message)

      toast.success('Your email has been sent.')

      router.replace(`/auth/verify-request?token_hash=${data?.token_hash}`)
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
