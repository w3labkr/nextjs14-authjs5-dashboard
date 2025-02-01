import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'

import { z } from 'zod'
import { signInSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = signInSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json({ user: null }, { status: STATUS_CODES.UNAUTHORIZED })
  // }

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

  if (user?.password && (await bcrypt.compare(data?.password, user?.password))) {
    return ApiResponse.json({ user }, { status: STATUS_CODES.OK, statusText: 'You have successfully logged in.' })
  }

  return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid email or password' })
}
