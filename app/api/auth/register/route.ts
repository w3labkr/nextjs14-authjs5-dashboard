import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { registerFormSchema } from '@/schemas/auth'

import dayjs from '@/lib/dayjs'
import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyCSRFToken } from '@/lib/csrf'

export async function POST(req: NextRequest) {
  const { csrfToken, ...body } = await req.json()

  if (!verifyCSRFToken(csrfToken)) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.UNAUTHORIZED, statusText: 'CSRF Token missing or incorrect' }
    )
  }

  const { data, success } = registerFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({ where: { email: data?.email } })

  if (user) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.CONFLICT, statusText: 'User already exists' })
  }

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          name: data?.email?.split('@')[0],
          email: data?.email,
          password: await generateHash(data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
    })
    return ApiResponse.json({ user: newUser }, { statusText: 'You have registered successfully' })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }
}
