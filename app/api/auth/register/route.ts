import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import dayjs from '@/lib/dayjs'

import { z } from 'zod'
import { registerSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

const ACCESS_TOKEN_EXPIRES_IN = +process.env.ACCESS_TOKEN_EXPIRES_IN!
const ACCESS_TOKEN_EXPIRES_BEFORE = +process.env.ACCESS_TOKEN_EXPIRES_BEFORE!

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = registerSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  if (user) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.CONFLICT, statusText: 'User already exists.' })
  }

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: data?.email,
          password: await generateHash(data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
          type: 'credentials',
          provider: 'credentials',
        },
      })
      const updated = await tx.user.update({
        where: {
          id: created.id,
        },
        data: {
          access_token: await generateAccessToken(created.id),
          expires_at: Math.floor(Date.now() / 1000 + ACCESS_TOKEN_EXPIRES_IN),
          refresh_token: await generateRefreshToken(created.id),
        },
      })
      return updated
    })

    return ApiResponse.json(
      { user: newUser },
      { status: STATUS_CODES.OK, statusText: 'You have registered successfully.' }
    )
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }
}
