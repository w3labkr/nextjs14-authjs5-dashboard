import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'

import { z } from 'zod'
import { verifyCodeSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { verifyJWT, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = verifyCodeSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json(null, { status: STATUS_CODES.UNAUTHORIZED })
  // }

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

  if (user?.code && (await bcrypt.compare(data?.code, user?.code))) {
    return ApiResponse.json(null, { status: STATUS_CODES.OK })
  }

  return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid code' })
}
