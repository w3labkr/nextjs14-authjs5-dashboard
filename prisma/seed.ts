import { PrismaClient } from '@prisma/client'
import { generateHash } from '@/lib/bcrypt'
import dayjs from '@/lib/dayjs'

const prisma = new PrismaClient()

export async function main() {
  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          name: 'me',
          email: 'me@example.com',
          password: await generateHash('qweqwe'),
          passwordChangedAt: dayjs().toISOString(),
        },
      })
    })
  } catch (e: unknown) {
    console.log(e)
  }
}

main()
