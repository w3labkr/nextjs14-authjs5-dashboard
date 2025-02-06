import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { verifyCsrfToken } from '@/auth'
import { verifyCodeFormSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { verifyJWT, type Token } from '@/lib/jose'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const authorized = verifyCsrfToken({ req, authorization })

  if (!authorized) {
    return ApiResponse.json(null, { status: STATUS_CODES.UNAUTHORIZED })
  }

  const body = await req.json()
  const { data, success } = verifyCodeFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const token = await verifyJWT<Token>(data?.token_hash)

  if (!token) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Token Expired' })
  }

  const user = await prisma.user.findUnique({ where: { email: token?.sub } })

  if (!user) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid User' })
  }

  if (user?.recovery_token !== data?.token_hash) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: 'Invalid Token' })
  }

  return ApiResponse.json(null, { status: STATUS_CODES.OK })
}
