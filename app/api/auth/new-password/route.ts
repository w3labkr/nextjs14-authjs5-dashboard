import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { newPasswordFormSchema } from '@/schemas/auth'
import dayjs from '@/lib/dayjs'

import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyJwt, type Token } from '@/lib/jwt'
import { verifyCsrfAndAjax } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = newPasswordFormSchema.safeParse(body)

  if (!verifyCsrfAndAjax(req)) {
    return ApiResponse.json({ message: 'Invalid csrf token' }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  if (!form.success) {
    return ApiResponse.json({}, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJwt<Token>(form.data?.token_hash)

  if (!token) {
    return ApiResponse.json({ message: 'Invalid or expired token' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({ where: { email: token?.sub } })

  if (!user) {
    return ApiResponse.json({ message: 'Invalid user' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  if (user?.recovery_token !== form.data?.token_hash) {
    return ApiResponse.json({ message: 'Invalid or expired token' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.update({
        where: { id: user?.id },
        data: {
          password: await generateHash(form.data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
    })
    return ApiResponse.json({ message: 'Your password has been changed.' })
  } catch (e: unknown) {
    return ApiResponse.json({ message: (e as Error)?.message }, { status: STATUS_CODES.INTERNAL_SERVER_ERROR })
  }
}
