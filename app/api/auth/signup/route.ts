import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'

import { z } from 'zod'
import { signUpSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = signUpSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json({ tokens: null }, STATUS_CODES.UNAUTHORIZED)
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

  const newUser = await prisma.user.create({
    data: {
      email: data?.email,
      password: await bcrypt.hash(data?.newPassword, 10),
      passwordChangedAt: dayjs().toISOString(),
      provider: 'credentials',
    },
  })

  const payload = { sub: newUser.id }
  const expires_in = 1 * 60 * 60 // 1h * 60m * 60s = 1 hour

  await prisma.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      access_token: await generateAccessToken(payload),
      expires_at: Math.floor(Date.now() / 1000 + expires_in),
      refresh_token: await generateRefreshToken(payload),
    },
  })

  return ApiResponse.json(
    { user: newUser },
    { status: STATUS_CODES.OK, statusText: 'You have registered successfully.' }
  )
}
