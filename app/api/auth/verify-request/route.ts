import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { verifyCodeFormSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { compareHash } from '@/lib/bcrypt'
import { verifyJWT, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, success } = verifyCodeFormSchema.safeParse(body)

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

  if (user?.code && (await compareHash(data?.code, user?.code))) {
    return ApiResponse.json(null, { status: STATUS_CODES.OK })
  }

  return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid code' })
}
