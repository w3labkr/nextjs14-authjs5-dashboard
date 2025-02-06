import type { User } from '@prisma/client'

export type API = { status: number; message: string; success: boolean }

export type AuthTokenAPI = {
  data: { tokens: { access_token: string; expires_in: number; refresh_token?: string } | null }
} & API

export type LoginAPI = { data: { user: User | null } } & API

export type RegisterAPI = { data: { user: User | null } } & API

export type ForgotPasswordAPI = { data: { token: string | null } } & API

export type NewPasswordAPI = { data: null } & API

export type VerifyRequestAPI = { data: { user: User | null } } & API
