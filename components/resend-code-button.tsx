'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { xhr } from '@/lib/utils'
import type { ForgotPasswordAPI } from '@/types/api'

export function ResendCodeButton({ mailto }: { mailto?: string }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      if (!mailto) return

      const { message, data } = await xhr.post<ForgotPasswordAPI>('/api/auth/forgot-password', {
        body: JSON.stringify({ email: mailto }),
      })

      if (!data?.token_hash) throw new Error(message)

      router.push(`/auth/verify-request?token_hash=${data?.token_hash}`)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button type="button" className="underline" onClick={handleSubmit} disabled={isSubmitting}>
      Click to resend
    </button>
  )
}
