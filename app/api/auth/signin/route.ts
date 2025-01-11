import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { ApiResponse, STATUS_CODES } from '@/lib/http-status-codes'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')

  // if (authorization !== `Bearer ${process.env.JWT_SECRET!}`) {
  //   return ApiResponse.json({ user: null }, STATUS_CODES.UNAUTHORIZED)
  // }

  const body = await req.json()
  const validatedField = z
    .object({
      email: z.string().max(255).email(),
      password: z.string().min(6).max(72),
    })
    .safeParse(body)

  if (!validatedField.success) {
    return ApiResponse.json({ user: null }, STATUS_CODES.BAD_REQUEST)
  }

  const data = validatedField.data
  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  if (!user) return ApiResponse.json({ user: null }, STATUS_CODES.BAD_REQUEST, 'Invalid identifier or password.')

  if (user?.password && (await bcrypt.compare(data?.password, user?.password))) {
    return ApiResponse.json({ user }, STATUS_CODES.OK, 'You have successfully logged in.')
  }

  return ApiResponse.json({ user: null }, STATUS_CODES.BAD_REQUEST, 'Invalid identifier or password.')
}
