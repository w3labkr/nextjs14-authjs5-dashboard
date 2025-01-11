import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

import { ApiResponse } from '@/lib/utils'
import { STATUS_CODES } from '@/lib/http-status-codes'

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

  if (!user) return ApiResponse.json({ user: null }, STATUS_CODES.OK, 'Invalid identifier or password')
  if (!user?.password) return ApiResponse.json({ user: null }, STATUS_CODES.OK, 'Invalid identifier or password')

  return (await bcrypt.compare(data?.password, user?.password))
    ? ApiResponse.json({ user })
    : ApiResponse.json({ user: null }, STATUS_CODES.OK, 'Invalid identifier or password')
}
