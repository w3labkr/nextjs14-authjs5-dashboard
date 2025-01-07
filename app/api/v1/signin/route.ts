import { type NextRequest } from 'next/server'
import { prisma } from "@/prisma"
import type { User } from "@prisma/client"
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

  const user = await prisma.user.findUnique({
    where: {
      email: body?.email,
    }
  })

  const hashPassword = user?.password

  if (hashPassword && (await bcrypt.compare(body?.password, hashPassword))) {
    return ApiResponse.json({ user })
  }

  return ApiResponse.json(data, STATUS_CODES.OK, 'Your email or password does not match.')
}
