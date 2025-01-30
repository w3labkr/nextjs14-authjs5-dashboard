import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'

import { z } from 'zod'
import { authTokenSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { generateAccessToken, generateRefreshToken, verifyJWT } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = authTokenSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  // return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.UNAUTHORIZED })
  // }

  if (!success) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (data?.grant_type !== 'refresh_token') {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid grant_type' })
  }

  const token = await verifyJWT<{ sub: string; exp: number }>(data?.refresh_token)

  if (!token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
  })

  if (!user || !user?.refresh_token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid identifier' })
  }

  if (user?.refresh_token !== data?.refresh_token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid refresh_token' })
  }

  const payload = { sub: user.id }
  const expires_in = 1 * 60 * 60 // 1 * 60m * 60s = 1h
  const expires_before = 10 * 60 * 1000 // 1 * 60s * 1000ms = 1m

  const newTokens = {
    access_token: await generateAccessToken(payload),
    expires_at: Math.floor(Date.now() / 1000 + expires_in),
    refresh_token: Date.now() < token?.exp * 1000 - expires_before ? undefined : await generateRefreshToken(payload),
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: newTokens,
  })

  return ApiResponse.json({ tokens: newTokens }, { status: STATUS_CODES.OK })
}
