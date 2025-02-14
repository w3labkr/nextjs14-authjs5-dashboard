import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { newPasswordFormSchema } from '@/schemas/auth'
import dayjs from '@/lib/dayjs'

import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyJwt, type Token } from '@/lib/jwt'
import { verifyCsrfToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!(await verifyCsrfToken(req))) {
    return ApiResponse.json({ message: 'Invalid csrf token' }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  const { data, success } = newPasswordFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({}, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJwt<Token>(data?.token_hash)

  if (!token) {
    return ApiResponse.json({}, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid or expired token' })
  }

  const user = await prisma.user.findUnique({ where: { email: token?.sub } })

  if (!user) {
    return ApiResponse.json({}, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid user' })
  }

  if (user?.recovery_token !== data?.token_hash) {
    return ApiResponse.json({}, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid or expired token' })
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
    return ApiResponse.json({ message: 'Your password has been changed.' })
  } catch (e: unknown) {
    return ApiResponse.json({}, { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message })
  }
}
