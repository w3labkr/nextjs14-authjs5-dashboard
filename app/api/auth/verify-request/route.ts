import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import bcrypt from 'bcryptjs'

import { z } from 'zod'
import { verifyRequestSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { verifyJWT } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = verifyRequestSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json(null, { status: STATUS_CODES.UNAUTHORIZED })
  // }

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJWT<{ sub: string; exp: number }>(data?.token_hash)

  if (!token) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({
    where: { email: token?.sub },
  })

  if (!user || !user?.code) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid code' })
  }

  if (await bcrypt.compare(data?.code, user?.code)) {
    // try {
    //   await prisma.$transaction([prisma.user.update({ where: { id: user?.id }, data: { code: null } })])
    // } catch (e: unknown) {
    //   return ApiResponse.json(
    //     { token_hash: null },
    //     { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    //   )
    // }
    return ApiResponse.json(null, { status: STATUS_CODES.OK })
  }

  return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid code' })
}
