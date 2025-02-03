import { z } from 'zod'

export const sidebarOptInFormSchema = z.object({
  email: z.string().min(4).max(255).email(),
})

export const profileFormSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().min(4).max(255).email(),
  bio: z.string().max(160).min(4),
  urls: z.array(z.object({ value: z.string().url() })).optional(),
})

export const accountFormSchema = z.object({
  username: z.string().min(2).max(30),
  dob: z.date(),
  language: z.string(),
})

export const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
  font: z.enum(['inter', 'manrope', 'system']),
})

export const notificationsFormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none']),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
})

export const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item)),
})
