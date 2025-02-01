import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dayjs from '@/lib/dayjs'
import { generateAccessToken, generateRefreshToken } from '@/lib/jose'

const prisma = new PrismaClient()

export async function main() {
  try {
    const newUser = await prisma.$transaction(async (tx) => {
      const newData = {
        email: 'me@example.com',
        password: await bcrypt.hash('123123', 10),
        passwordChangedAt: dayjs().toISOString(),
        type: 'credentials',
        provider: 'credentials',
      }
      const created = await tx.user.create({ data: newData })
      const expires_in = 1 * 60 * 60 // 1 * 60m * 60s = 1h

      return await tx.user.update({
        where: {
          id: created.id,
        },
        data: {
          access_token: await generateAccessToken({ sub: created.id }),
          expires_at: Math.floor(Date.now() / 1000 + expires_in),
          refresh_token: await generateRefreshToken({ sub: created.id }),
        },
      })
    })
  } catch (e: unknown) {
    console.log(e)
  }
}

main()
