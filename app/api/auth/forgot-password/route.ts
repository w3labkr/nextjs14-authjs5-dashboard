import { type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { transporter, sender } from '@/lib/nodemailer'

import { z } from 'zod'
import { forgotPasswordSchema } from '@/schemas/auth'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/utils'
import { siteConfig } from '@/config/site'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const body = await req.json()
  const { data, success } = forgotPasswordSchema.safeParse(body)

  // if (authorization !== `Bearer ${process.env.AUTH_SECRET}`) {
  // return ApiResponse.json(null, { status: STATUS_CODES.UNAUTHORIZED })
  // }

  if (!success) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST })
  }

  const user = await prisma.user.findUnique({
    where: { email: data?.email },
  })

  // Given an incoming request...
  const url = new URL('/auth/verify-code', req.url)

  // Add ?from=/incoming-url to the /login URL
  // url.searchParams.set('from', req.nextUrl.pathname)

  if (!user) {
    return ApiResponse.redirect(new URL(url, req.url))
  }

  console.log({ data, user })

  // ...
  const mailOptions = mailTemplate(user.email)

  try {
    // const info = await transporter.sendMail(mailOptions)
    // console.log({ info })

    return ApiResponse.redirect(new URL(url, req.url))
  } catch (e: unknown) {
    return ApiResponse.json(null, { status: STATUS_CODES.BAD_REQUEST, statusText: (e as Error)?.message })
  }
}

function mailTemplate(to: string) {
  const code = generateDigitCode(100000, 999999)
  const username = to.replace(/@.*/, '')

  return {
    from: `"${sender?.name}" <${sender?.email}>`,
    to,
    subject: `${siteConfig.title} one-time password`,
    html: `
      <div>
        <h2>This is a one-time password.</h2>
        <p>Someone has requested a password reset for the following account:</p>
        <p>Username: ${username}</p>
        <p>Your password expires in 15 minutes.</p>
        <p>${code}</p>
        <p>If this was a mistake, just ignore this email and nothing will happen.</p>
      </div>
    `,
  }
}

function generateDigitCode(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
