import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'

import { z } from 'zod'
import { authTokenSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateAccessToken, generateRefreshToken, verifyJWT, type Token } from '@/lib/jose'

const ACCESS_TOKEN_EXPIRES_IN = +process.env.ACCESS_TOKEN_EXPIRES_IN!
const ACCESS_TOKEN_EXPIRES_BEFORE = +process.env.ACCESS_TOKEN_EXPIRES_BEFORE!

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = authTokenSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (data?.grant_type !== 'refresh_token') {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid grant_type' })
  }

  const token = await verifyJWT<Token>(data?.refresh_token)

  if (!token) {
    return ApiResponse.json({ tokens: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Token Expired' })
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
    expires_at: Math.floor(Date.now() / 1000 + ACCESS_TOKEN_EXPIRES_IN),
    refresh_token:
      Date.now() < (token?.exp - ACCESS_TOKEN_EXPIRES_BEFORE) * 1000 ? undefined : await generateRefreshToken(user.id),
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
