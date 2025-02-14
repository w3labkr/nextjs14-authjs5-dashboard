import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { registerFormSchema } from '@/schemas/auth'

import dayjs from '@/lib/dayjs'
import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'
import { verifyCsrfToken } from '@/lib/jwt'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = registerFormSchema.safeParse(body)

  if (!(await verifyCsrfToken(req))) {
    return ApiResponse.json({ user: null, message: 'Invalid csrf token' }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  if (!form.success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({ where: { email: form.data?.email } })

  if (user) {
    return ApiResponse.json({ user: null, message: 'User already exists' }, { status: STATUS_CODES.CONFLICT })
  }

  try {
    const newUser = await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          name: form.data?.email?.split('@')[0],
          email: form.data?.email,
          password: await generateHash(form.data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
    })
    return ApiResponse.json({ user: newUser, message: 'You have registered successfully' })
  } catch (e: unknown) {
    return ApiResponse.json(
      { user: null, message: (e as Error)?.message },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}
