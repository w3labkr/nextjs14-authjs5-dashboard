import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { transporter, sender } from '@/lib/nodemailer'
import bcrypt from 'bcryptjs'

import { z } from 'zod'
import { forgotPasswordSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { getRandomIntInclusive } from '@/lib/math'
import { jwtSign } from '@/lib/jose'
import { siteConfig } from '@/config/site'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = forgotPasswordSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  //   return ApiResponse.json({ token_hash: null }, { status: STATUS_CODES.UNAUTHORIZED })
  // }

  if (!success) {
    return ApiResponse.json({ token_hash: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const code = getRandomIntInclusive(100000, 999999).toString()
  const token_hash = await jwtSign({ sub: data?.email }, '15m')

  console.log({ code })

  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  if (!user) {
    return ApiResponse.json({ token_hash }, { status: STATUS_CODES.OK })
  }

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: user?.id }, data: { code: await bcrypt.hash(code, 10) } }),
    ])
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }

  try {
    // send mail with defined transport object
    // const info = await transporter.sendMail({
    //   from: `"${sender?.name}" <${sender?.email}>`,
    //   to: user?.email,
    //   subject: `${siteConfig.title} one-time password`,
    //   html: html(code),
    // })
    // console.log(info)

    return ApiResponse.json({ token_hash }, { status: STATUS_CODES.OK })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token_hash: null },
      { status: STATUS_CODES.BAD_REQUEST, statusText: (e as Error)?.message }
    )
  }
}

function html(code: string) {
  return `
  <div>
    <h2>This is a one-time password.</h2>
    <p>Someone has requested a password reset for the following account:</p>
    <p>Your password expires in 15 minutes.</p>
    <p>${code}</p>
    <p>If this was a mistake, just ignore this email and nothing will happen.</p>
  </div>
`
}
