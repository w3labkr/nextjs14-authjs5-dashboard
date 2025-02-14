import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { refreshTokenApiSchema } from '@/schemas/auth'

import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { generateAccessToken, generateTokenExpiresAt, generateRefreshToken, decodeJwt, type Token } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = refreshTokenApiSchema.safeParse(body)

  if (!form.success) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (form.data?.grant_type !== 'refresh_token') {
    return ApiResponse.json({ tokens: null, message: 'Invalid grant_type' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = decodeJwt<Token>(form.data?.refresh_token)
  const user = await prisma.user.findUnique({ where: { id: token.sub } })

  if (!user) {
    return ApiResponse.json({ tokens: null, message: 'Invalid user' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (user?.refresh_token !== form.data?.refresh_token) {
    return ApiResponse.json({ tokens: null, message: 'Invalid refresh_token' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const newTokens = {
    access_token: await generateAccessToken(user.id),
    expires_at: generateTokenExpiresAt(),
    refresh_token: await generateRefreshToken(user.id, user.refresh_token),
  }

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      return await tx.user.update({ where: { id: user.id }, data: newTokens })
    })
    return ApiResponse.json({
      tokens: {
        access_token: newUser.access_token,
        expires_at: newUser.expires_at,
        refresh_token: newUser.refresh_token,
      },
    })
  } catch (e: unknown) {
    return ApiResponse.json(
      { tokens: null, message: (e as Error)?.message },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}
