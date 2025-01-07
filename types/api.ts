import type { User } from "@prisma/client";

export type API = { success: boolean, status: number; message: string }

export type SignInAPI = {data: { user: User | null }} & API

export type SignUpAPI = {data: { user: User | null }} & API

