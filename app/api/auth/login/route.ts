import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { loginFormSchema } from '@/schemas/auth'

import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { generateAccessToken, generateTokenExpiresAt, generateRefreshToken } from '@/lib/jwt'
import { compareHash } from '@/lib/bcrypt'
import { verifyAjax } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = loginFormSchema.safeParse(body)

  if (!verifyAjax(req)) {
    return new NextResponse('Invalid or missing X-Requested-With header', { status: STATUS_CODES.UNAUTHORIZED })
  }

  if (!form.success) {
    return ApiResponse.json({ user: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({ where: { email: form.data?.email } })

  if (!user) {
    return ApiResponse.json({ user: null, message: 'Invalid email or password' }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const newTokens = {
    access_token: await generateAccessToken(user.id),
    expires_at: generateTokenExpiresAt(),
    refresh_token: await generateRefreshToken(user.id, user.refresh_token),
  }

  if (user?.password && (await compareHash(form.data?.password, user?.password))) {
    try {
      const newUser = await prisma.$transaction(async (tx) => {
        return await tx.user.update({ where: { id: user.id }, data: newTokens })
      })
      return ApiResponse.json({ user: newUser, message: 'You have successfully logged in' })
    } catch (e: unknown) {
      return ApiResponse.json(
        { user: null, message: (e as Error)?.message },
        { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
      )
    }
  }

  return ApiResponse.json({ user: null, message: 'Invalid email or password' }, { status: STATUS_CODES.BAD_REQUEST })
}
