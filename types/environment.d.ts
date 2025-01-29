import 'next'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_NAME: string
      NEXT_PUBLIC_APP_URL: string
      CRON_SECRET: string
      JWT_SECRET: string
      AUTH_SECRET: string
      AUTH_GOOGLE_ID: string
      AUTH_GOOGLE_SECRET: string
      DATABASE_URL: string
      DIRECT_URL: string
      NEXT_PUBLIC_SUPABASE_PROJECT_ID: string
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET: string
      SUPABASE_URL: string
      SUPABASE_SERVICE_ROLE_KEY: string
      SUPABASE_JWT_SECRET: string
      SUPABASE_DATABASE_HOST: string
      SUPABASE_DATABASE_POST: string
      SUPABASE_DATABASE_NAME: string
      SUPABASE_DATABASE_USER: string
      SUPABASE_DATABASE_PASSWORD: string
      SMTP_SENDER_EMAIL: string
      SMTP_SENDER_NAME: string
      SMTP_BREVO_USER: string
      SMTP_BREVO_PASS: string
      SMTP_GMAIL_USER: string
      SMTP_GMAIL_PASS: string
      [key: string]: string | undefined
    }
  }
}
