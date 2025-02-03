import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { loginFormSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { compareHash } from '@/lib/bcrypt'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = loginFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  if (!user) {
    return ApiResponse.json(
      { user: null },
      { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid email or password' }
    )
  }

  if (user?.password && (await compareHash(data?.password, user?.password))) {
    return ApiResponse.json({ user }, { status: STATUS_CODES.OK, statusText: 'You have successfully logged in.' })
  }

  return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid email or password' })
}
