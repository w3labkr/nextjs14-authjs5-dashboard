import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'

import { z } from 'zod'
import { authTokenSchema } from '@/schemas/auth'

import { ApiResponse, STATUS_CODES } from '@/lib/http-status-codes'
import { generateAccessToken, generateRefreshToken, decodeJwt } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = authTokenSchema.safeParse(body)

  if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  if (!success) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  if (data.grant_type !== 'refresh_token') {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  const token = decodeJwt(data.refresh_token)

  if (!token || !token?.sub || !token?.exp) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
  })

  if (!user) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  if (!user || !user?.refresh_token) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
  }

  if (user?.refresh_token !== data.refresh_token) {
    return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
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

  return ApiResponse.json({ tokens: newTokens }, STATUS_CODES.OK)
}
