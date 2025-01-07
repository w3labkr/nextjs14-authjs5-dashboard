import { type NextRequest } from 'next/server'
import { prisma } from "@/prisma"
import type { User } from "@prisma/client"
import dayjs from '@/lib/dayjs'
import bcrypt from 'bcryptjs'

import { ApiResponse } from '@/lib/utils'
import { STATUS_CODES } from '@/lib/http-status-codes'

interface RequestBody {
  email: string;
  password: string;
}

interface ResponseBody {
  user: User | null;
}

export async function POST(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const body: RequestBody = await request.json()
  const data: ResponseBody = { user: null }

  // if (authorization !== `Bearer ${process.env.SECRET_KEY!}`) {
  //   return ApiResponse.json(data, STATUS_CODES.UNAUTHORIZED)
  // }

  if (!body?.email) return ApiResponse.json(data, STATUS_CODES.BAD_REQUEST)
  if (!body?.password) return ApiResponse.json(data, STATUS_CODES.BAD_REQUEST)

  let user = await prisma.user.findUnique({
    where: { email: body?.email }
  })

  if (user) {
    return ApiResponse.json(data, STATUS_CODES.OK, 'User already registered.')
  }

  user = await prisma.user.create({
    data: {
      email: body?.email,
      password: await bcrypt.hash(body?.password, 10),
      passwordChangedAt: dayjs().toISOString(),
    },
  })

  return ApiResponse.json({ user })
}
