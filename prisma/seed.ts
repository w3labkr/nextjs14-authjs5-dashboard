import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

const prisma = new PrismaClient()

const ACCESS_TOKEN_EXPIRES_IN = +process.env.ACCESS_TOKEN_EXPIRES_IN!
const ACCESS_TOKEN_EXPIRES_BEFORE = +process.env.ACCESS_TOKEN_EXPIRES_BEFORE!

export async function main() {
  try {
    const newUser = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: 'me@example.com',
          password: await bcrypt.hash('123123', 10),
          passwordChangedAt: dayjs().toISOString(),
          type: 'credentials',
          provider: 'credentials',
        },
      })
      const updated = await tx.user.update({
        where: {
          id: created.id,
        },
        data: {
          access_token: await generateAccessToken(created.id),
          expires_at: Math.floor(Date.now() / 1000 + ACCESS_TOKEN_EXPIRES_IN),
          refresh_token: await generateRefreshToken(created.id),
        },
      })
      return updated
    })
  } catch (e: unknown) {
    console.log(e)
  }
}

main()
