import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

const prisma = new PrismaClient()

export async function main() {
  const users: Prisma.UserCreateInput[] = [
    {
      email: 'me@example.com',
      password: await bcrypt.hash('123123', 10),
      passwordChangedAt: dayjs().toISOString(),
      provider: 'credentials',
    },
  ]

  for (const user of users) {
    const newUser = await prisma.user.create({ data: user })

    const payload = { sub: newUser.id }
    const expires_in = 1 * 60 * 60 // 1 * 60m * 60s = 1h

    await prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        access_token: await generateAccessToken(payload),
        expires_at: Math.floor(Date.now() / 1000 + expires_in),
        refresh_token: await generateRefreshToken(payload),
      },
    })
  }
}

main()
