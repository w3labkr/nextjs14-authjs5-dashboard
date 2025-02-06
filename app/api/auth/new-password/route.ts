import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { newPasswordFormSchema } from '@/schemas/auth'
import dayjs from '@/lib/dayjs'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyJwt, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  // const authorization = req.headers.get('authorization')

  // if (authorization !== `Bearer ${csrfToken}`) {
  //   return ApiResponse.json({ token: null }, { status: STATUS_CODES.UNAUTHORIZED })
  // }

  const body = await req.json()
  const { data, success } = newPasswordFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJwt<Token>(data?.token_hash)

  if (!token) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Token Expired' })
  }

  const user = await prisma.user.findUnique({ where: { email: token?.sub } })

  if (!user) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid User' })
  }

  if (user?.recovery_token !== data?.token_hash) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid Token' })
  }

  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.update({
        where: { id: user?.id },
        data: {
          password: await generateHash(data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
    })
    return ApiResponse.json(null, { status: STATUS_CODES.OK })
  } catch (e: unknown) {
    return ApiResponse.json(null, { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message })
  }
}
