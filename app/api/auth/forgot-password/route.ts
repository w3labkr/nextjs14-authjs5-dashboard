import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { verifyCsrfToken } from '@/auth'
import { forgotPasswordFormSchema } from '@/schemas/auth'
import { transporter, sender } from '@/lib/nodemailer'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { getRandomIntInclusive } from '@/lib/math'
import { generateRecoveryToken } from '@/lib/jose'
import { generateHash } from '@/lib/bcrypt'

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization')
  const authorized = verifyCsrfToken({ req, authorization })

  if (!authorized) {
    return ApiResponse.json({ token: null }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  const body = await req.json()
  const { data, success } = forgotPasswordFormSchema.safeParse(body)

  if (!success) {
    return ApiResponse.json({ token: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const code = getRandomIntInclusive(100000, 999999).toString()
  const token = await generateRecoveryToken(data?.email, {
    code: await generateHash(code),
  })

  const user = await prisma.user.findUnique({ where: { email: data?.email } })

  if (!user) {
    return ApiResponse.json({ token }, { status: STATUS_CODES.OK })
  }

  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.update({ where: { id: user?.id }, data: { recovery_token: token } })
    })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }

  try {
    console.log({ code })
    // const info = await transporter.sendMail({
    //   from: `"${sender?.name}" <${sender?.email}>`,
    //   to: user?.email,
    //   subject: `[${sender?.name}] Reset your password`,
    //   text: text({ code }),
    //   html: html({ code }),
    // })
    return ApiResponse.json({ token }, { status: STATUS_CODES.OK })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, statusText: (e as Error)?.message }
    )
  }
}

function html({ code }: { code: string }) {
  return `
  <div>
    <h2>Hello,</h2>
    <br />
    <p>Your account verification code is:</p>
    <p>${code}</p>
    <br />
    <p>This code expires in 15 minutes. Please do not share this code with anyone.</p>
    <br />
    <p>If you did not request a code, you can ignore this email.</p>
  </div>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ code }: { code: string }) {
  return `Your account verification code is ${code}.`
}
