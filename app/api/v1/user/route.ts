import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const email = searchParams.get('email') as string

  const user = await prisma.user.findUnique({
    where: { email },
  })

  return ApiResponse.json({ user }, { status: STATUS_CODES.OK })
}
