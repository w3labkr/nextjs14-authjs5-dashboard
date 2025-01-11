import { type NextRequest } from 'next/server'
import { prisma } from "@/prisma"
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'

import { ApiResponse } from '@/lib/utils'
import { STATUS_CODES } from '@/lib/http-status-codes'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('Authorization')

  // if (authorization !== `Bearer ${process.env.JWT_SECRET!}`) {
  //   return ApiResponse.json(data, STATUS_CODES.UNAUTHORIZED)
  // }

  const body = await req.json()
  const validatedField = z.object({
    email: z.string().max(255).email(),
    password: z.string().min(6).max(72),
  }).safeParse(body)

  if (!validatedField.success) {
    return ApiResponse.json({ user: null }, STATUS_CODES.BAD_REQUEST)
  }

  const data = validatedField.data
  const user = await prisma.user.findUnique({
    where: { email: data?.email }
  })

  if (user) {
    return ApiResponse.json({ user: null }, STATUS_CODES.OK, 'User already registered.')
  }

  const newUser = await prisma.user.create({
    data: {
      email: data?.email,
      password: await bcrypt.hash(data?.password, 10),
      passwordChangedAt: dayjs().toISOString(),
    },
  })

  // let account = await prisma.account.create({
  //   data: {
  //     userId: user.id,
  //     type: 'oidc',
  //     provider: 'credentials',
  //     providerAccountId: user.id,
  //     // refresh_token: '',
  //     // access_token: '',
  //     // expires_at: 1736578268,
  //     // token_type: 'bearer',
  //     // scope: 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  //     // id_token: '',
  //     // session_state: null,
  //   },
  // })

  return ApiResponse.json({ user: newUser })
}
