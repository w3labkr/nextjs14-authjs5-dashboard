import type { User } from '@prisma/client'

export type SignInAPI = { status: number; message: string; success: boolean; data: { user: User | null } }

export type SignUpAPI = { status: number; message: string; success: boolean; data: { user: User | null } }
