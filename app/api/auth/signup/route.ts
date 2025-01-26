import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'

import { z } from 'zod'
import { signUpSchema } from '@/schemas/auth'

import { ApiResponse, STATUS_CODES } from '@/lib/http-status-codes'
import { jwtSign } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const validatedField = signUpSchema.safeParse(body)

  if (!validatedField.success) {
    return ApiResponse.json({ user: null }, STATUS_CODES.BAD_REQUEST)
  }

  const data = validatedField.data
  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  if (user) {
    return ApiResponse.json({ user: null }, STATUS_CODES.CONFLICT, 'User already exists.')
  }

  const newUser = await prisma.user.create({
    data: {
      email: data?.email,
      password: await bcrypt.hash(data?.newPassword, 10),
      passwordChangedAt: dayjs().toISOString(),
    },
  })

  const payload = {
    name: newUser.name,
    email: newUser.email,
    picture: newUser.image,
    sub: newUser.id,
  }
  const expiresIn = 3600 // 1 hours (seconds)
  const expiresAt = Math.floor(Date.now() / 1000) + expiresIn
  const accessToken = await jwtSign(payload, expiresAt)
  const refreshToken = await jwtSign(payload, '30d')

  const newAccount = await prisma.account.create({
    data: {
      userId: newUser.id,
      type: 'oidc',
      provider: 'credentials',
      providerAccountId: newUser.id,
      refresh_token: refreshToken,
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: expiresAt,
      token_type: 'bearer',
      scope: `openid ${process.env.NEXT_PUBLIC_APP_URL!}/api/auth/token`,
      id_token: null,
      session_state: null,
    },
  })

  return ApiResponse.json({ user: newUser }, STATUS_CODES.OK, 'You have registered successfully.')
}
