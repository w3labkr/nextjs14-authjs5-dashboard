import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from "@/prisma"
import type { SignUpAPI } from '@/types/api'

export async function POST(request: NextRequest) {
  const { email, password }: SignUpAPI = await request.json()

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return NextResponse.json({ user: null, message: 'Invalid credentials.' })
  }

  return NextResponse.json({ user, message: 'OK' })
}
