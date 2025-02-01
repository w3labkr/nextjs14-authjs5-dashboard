import { z } from 'zod'

export const authTokenSchema = z.object({
  grant_type: z.string(),
  refresh_token: z.string(),
})

export const loginSchema = z.object({
  email: z.string().max(255).email(),
  password: z.string().min(6).max(72),
  rememberMe: z.boolean().default(false),
})

export const registerSchema = z
  .object({
    email: z.string().min(4).max(255).email(),
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    newPassword: z.string().min(6).max(72),
    confirmNewPassword: z.string().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().max(255).email(),
})

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(6).max(72),
    confirmNewPassword: z.string().min(6).max(72),
    code: z.string().length(6),
    token_hash: z.string(),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
  })

export const verifyCodeSchema = z.object({
  code: z.string().length(6),
  token_hash: z.string(),
})
