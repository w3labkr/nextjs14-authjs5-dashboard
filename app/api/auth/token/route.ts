import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'

import { z } from 'zod'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import {
  generateAccessToken,
  generateTokenExpiresAt,
  generateRefreshToken,
  isTokenExpired,
  verifyJWT,
  type Token,
} from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = z.object({ grant_type: z.string(), refresh_token: z.string() }).safeParse(body)

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
    refresh_token: !isTokenExpired(token?.exp) ? undefined : await generateRefreshToken(user.id),
  }

  try {
    await prisma.$transaction([prisma.user.update({ where: { id: user.id }, data: newTokens })])
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }

  return ApiResponse.json({ tokens: newTokens }, { status: STATUS_CODES.OK })
}
