import type { User } from '@prisma/client'

export type AuthTokens = {
  access_token: string
  expires_in: number
  refresh_token?: string
}

export type AuthTokenAPI = {
  status: number
  message: string
  success: boolean
  data: { tokens: AuthTokens | null }
}

export type SignInAPI = {
  status: number
  message: string
  success: boolean
  data: { user: User | null }
}

export type SignUpAPI = {
  status: number
  message: string
  success: boolean
  data: { user: User | null }
}

export type ForgotPasswordAPI = {
  status: number
  message: string
  success: boolean
  data: { token_hash: string | null }
}

export type VerifyRequestAPI = {
  status: number
  message: string
  success: boolean
  data: null
}
