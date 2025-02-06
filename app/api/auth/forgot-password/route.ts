import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { forgotPasswordFormSchema } from '@/schemas/auth'
import { transporter, sender } from '@/lib/nodemailer'

import { STATUS_CODES } from '@/lib/http-status-codes/en'
import { ApiResponse } from '@/lib/http'
import { getRandomIntInclusive } from '@/lib/math'
import { generateRecoveryToken } from '@/lib/jose'
import { generateHash } from '@/lib/bcrypt'
import { verifyCSRFToken } from '@/lib/csrf'

export async function POST(req: NextRequest) {
  const { csrfToken, ...body } = await req.json()

  if (!verifyCSRFToken(csrfToken)) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.UNAUTHORIZED, message: 'CSRF Token missing or incorrect' }
    )
  }

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
    return ApiResponse.json({ token })
  }

  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.update({ where: { id: user?.id }, data: { recovery_token: token } })
    })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, message: (e as Error)?.message }
    )
  }

  try {
    const info = await transporter.sendMail({
      from: `"${sender?.name}" <${sender?.email}>`,
      to: user?.email,
      subject: `[${sender?.name}] Reset your password`,
      text: text({ code }),
      html: html({ code }),
    })
    return ApiResponse.json({ token })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR, message: (e as Error)?.message }
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
