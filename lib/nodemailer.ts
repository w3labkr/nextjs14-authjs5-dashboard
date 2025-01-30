import * as nodemailer from 'nodemailer'

export const sender = {
  name: process.env.EMAIL_NAME!,
  email: process.env.EMAIL_FROM!,
}

export const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_BREVO_USER!,
    pass: process.env.EMAIL_BREVO_PASS!,
  },
})

export const gmailTransporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_GMAIL_USER!,
    pass: process.env.EMAIL_GMAIL_PASS!,
  },
})

export const transporter = brevoTransporter
