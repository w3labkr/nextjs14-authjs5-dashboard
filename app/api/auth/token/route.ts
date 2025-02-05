import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { refreshTokenApiSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateAccessToken, generateTokenExpiresAt, generateRefreshToken, verifyJWT, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = refreshTokenApiSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (data?.grant_type !== 'refresh_token') {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid grant_type' })
  }

  const token = await verifyJWT<Token>(data?.refresh_token)

  if (!token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid refresh_token' })
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
  })

  if (!user || !user?.refresh_token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid User' })
  }

  if (user?.refresh_token !== data?.refresh_token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid refresh_token' })
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
    return ApiResponse.json(
      {
        tokens: {
          access_token: newUser.access_token,
          expires_at: newUser.expires_at,
          refresh_token: newUser.refresh_token,
        },
      },
      { status: STATUS_CODES.OK }
    )
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }
}
