import type { User } from '@prisma/client'

export type API = { status: number; message: string; success: boolean }

export type AuthTokenAPI = {
  data: { tokens: { access_token: string; expires_in: number; refresh_token?: string } | null }
} & API

export type SignInAPI = { data: { user: User | null } } & API

export type SignUpAPI = { data: { user: User | null } } & API

export type ForgotPasswordAPI = { data: { token_hash: string | null } } & API

export type NewPasswordAPI = { data: null } & API

export type VerifyRequestAPI = { data: null } & API
