import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { verifyCsrfToken } from '@/lib/next-auth'
import { registerFormSchema } from '@/schemas/auth'

import dayjs from '@/lib/dayjs'
import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { generateHash } from '@/lib/bcrypt'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const authorized = verifyCsrfToken({ req, authorization })

  if (!authorized) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  const body = await req.json()
  const { data, success } = registerFormSchema.safeParse(body)

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
      return await tx.user.create({
        data: {
          name: data?.email?.split('@')[0],
          email: data?.email,
          password: await generateHash(data?.newPassword),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
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
