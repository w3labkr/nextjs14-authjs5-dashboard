import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'

import { z } from 'zod'
import { signUpSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

const ACCESS_TOKEN_EXPIRES_IN = +process.env.ACCESS_TOKEN_EXPIRES_IN!
const ACCESS_TOKEN_EXPIRES_BEFORE = +process.env.ACCESS_TOKEN_EXPIRES_BEFORE!

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = signUpSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json({ user: null }, STATUS_CODES.UNAUTHORIZED)
  // }

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
          password: await bcrypt.hash(data?.newPassword, 10),
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
