import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { loginFormSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { compareHash } from '@/lib/bcrypt'
import { generateAccessToken, generateTokenExpiresAt, generateRefreshToken } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = loginFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({ where: { email: data?.email } })

  if (!user) {
    return ApiResponse.json(
      { user: null },
      { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid email or password' }
    )
  }

  const newTokens = {
    access_token: await generateAccessToken(user.id),
    expires_at: generateTokenExpiresAt(),
    refresh_token: await generateRefreshToken(user.id, user.refresh_token),
  }

  if (user?.password && (await compareHash(data?.password, user?.password))) {
    try {
      const newUser = await prisma.$transaction(async (tx) => {
        return await tx.user.update({ where: { id: user.id }, data: newTokens })
      })
      return ApiResponse.json(
        { user: newUser },
        { status: STATUS_CODES.OK, statusText: 'You have successfully logged in.' }
      )
    } catch (e: unknown) {
      return ApiResponse.json(
        { user: null },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
      )
    }
  }

  return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid email or password' })
}
