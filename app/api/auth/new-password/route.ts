import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { newPasswordFormSchema } from '@/schemas/auth'
import dayjs from '@/lib/dayjs'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyJwt, type Token } from '@/lib/jose'
import { verifyCSRFToken } from '@/lib/csrf'

export async function POST(req: NextRequest) {
  const { csrfToken, ...body } = await req.json()

  if (!verifyCSRFToken(csrfToken)) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.UNAUTHORIZED, statusText: 'CSRF Token missing or incorrect' }
    )
  }

  const { data, success } = newPasswordFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJwt<Token>(data?.token_hash)

  if (!token) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid or expired token' })
  }

  const user = await prisma.user.findUnique({ where: { email: token?.sub } })

  if (!user) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid user' })
  }

  if (user?.recovery_token !== data?.token_hash) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid or expired token' })
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
    return ApiResponse.json(null)
  } catch (e: unknown) {
    return ApiResponse.json(null, { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message })
  }
}
