import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/prisma'
import { forgotPasswordFormSchema } from '@/schemas/auth'
import { transporter, sender } from '@/lib/nodemailer'

import { ApiResponse, STATUS_CODES } from '@/lib/http'
import { getRandomIntInclusive } from '@/lib/math'
import { generateRecoveryToken } from '@/lib/jwt'
import { generateHash } from '@/lib/bcrypt'
import { verifyCsrfAndAjax } from '@/lib/crypto'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const form = forgotPasswordFormSchema.safeParse(body)

  if (!verifyCsrfAndAjax(req)) {
    return ApiResponse.json({ token: null, message: 'Invalid csrf token' }, { status: STATUS_CODES.UNAUTHORIZED })
  }

  if (!form.success) {
    return ApiResponse.json({ token: null }, { status: STATUS_CODES.BAD_REQUEST })
  }

  const code = getRandomIntInclusive(100000, 999999).toString()
  const token = await generateRecoveryToken(form.data?.email, {
    code: await generateHash(code),
  })

  const user = await prisma.user.findUnique({ where: { email: form.data?.email } })

  if (!user) {
    return ApiResponse.json({ token, message: 'An email has been sent to reset your password.' })
  }

  try {
    await prisma.$transaction(async (tx) => {
      return await tx.user.update({ where: { id: user?.id }, data: { recovery_token: token } })
    })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null, message: (e as Error)?.message },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }

  try {
    const info = await transporter.sendMail({
      from: `"${sender?.name}" <${sender?.email}>`,
      to: user?.email,
      subject: `[${sender?.name}] Reset Your Password`,
      text: text({ code }),
      html: html({ code }),
    })
    return ApiResponse.json({ token, message: 'An email has been sent to reset your password.' })
  } catch (e: unknown) {
    return ApiResponse.json(
      { token: null, message: (e as Error)?.message },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }
}

function html({ code }: { code: string }) {
  return `
  <div>
    <h2>Reset Password</h2>
    <br />
    <p>Your verification code is:</p>
    <p>${code}</p>
    <br />
    <p>This code expires in 15 minutes. Please do not share this code with anyone.</p>
    <p>If you did not request a code, you can ignore this email.</p>
  </div>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ code }: { code: string }) {
  return `Your verification code is ${code}.`
}
