import 'next'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_NAME: string
      NEXT_PUBLIC_APP_URL: string
      CRON_SECRET: string
      JWT_SECRET: string

      AUTH_SECRET: string
      AUTH_GITHUB_ID: string
      AUTH_GITHUB_SECRET: string
      AUTH_GOOGLE_ID: string
      AUTH_GOOGLE_SECRET: string
      AUTH_FACEBOOK_ID: string
      AUTH_FACEBOOK_SECRET: string
      AUTH_INSTAGRAM_ID: string
      AUTH_INSTAGRAM_SECRET: string
      AUTH_KAKAO_ID: string
      AUTH_KAKAO_SECRET: string
      AUTH_NAVER_ID: string
      AUTH_NAVER_SECRET: string
      AUTH_TWITTER_ID: string
      AUTH_TWITTER_SECRET: string

      DATABASE_URL: string
      DIRECT_URL: string

      EMAIL_SERVER: string
      EMAIL_SERVER_HOST: string
      EMAIL_SERVER_PORT: string
      EMAIL_SERVER_USER: string
      EMAIL_SERVER_PASSWORD: string
      EMAIL_FROM: string
      EMAIL_NAME: string
      EMAIL_BREVO_USER: string
      EMAIL_BREVO_PASS: string
      EMAIL_GMAIL_USER: string
      EMAIL_GMAIL_PASS: string

      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_ID: string

      SUPABASE_SERVICE_ROLE_KEY: string
      SUPABASE_JWT_SECRET: string

      SUPABASE_DATABASE_HOST: string
      SUPABASE_DATABASE_POST: string
      SUPABASE_DATABASE_NAME: string
      SUPABASE_DATABASE_USER: string
      SUPABASE_DATABASE_PASSWORD: string

      [key: string]: string | undefined
    }
  }
}
