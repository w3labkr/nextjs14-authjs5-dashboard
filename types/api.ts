import type { User } from '@prisma/client'
import type { API } from '@/lib/http'

export interface AuthTokenAPI extends API {
  data: { tokens: { access_token: string; expires_in: number; refresh_token?: string } | null }
}

export interface LoginAPI extends API {
  data: { user: User | null }
}

export interface RegisterAPI extends API {
  data: { user: User | null }
}

export interface ForgotPasswordAPI extends API {
  data: { token: string | null }
}

export interface NewPasswordAPI extends API {
  data: null
}

export interface VerifyRequestAPI extends API {
  data: { user: User | null }
}

export interface CSRFTokenAPI extends API {
  data: { token: string }
}
