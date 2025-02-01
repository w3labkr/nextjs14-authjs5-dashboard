import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import dayjs from '@/lib/dayjs'

import { z } from 'zod'
import { newPasswordSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { compareHash, generateHash } from '@/lib/bcrypt'
import { verifyJWT, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = newPasswordSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJWT<Token>(data?.token_hash)

  if (!token) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Token Expired' })
  }

  const user = await prisma.user.findUnique({
    where: { email: token?.sub },
  })

  if (!user) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid User' })
  }

  if (user?.code && (await compareHash(data?.code, user?.code))) {
    try {
      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            password: await generateHash(data?.newPassword),
            passwordChangedAt: dayjs().toISOString(),
            code: null,
          },
        }),
      ])
    } catch (e: unknown) {
      return ApiResponse.json(null, { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message })
    }
    return ApiResponse.json(null, { status: STATUS_CODES.OK })
  }

  return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid code' })
}
