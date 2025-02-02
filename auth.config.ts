import { cookies } from 'next/headers'
import { CredentialsSignin, type User, type NextAuthConfig } from 'next-auth'
import { type JWT } from 'next-auth/jwt'

import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { z } from 'zod'
import { loginFormSchema } from '@/components/login-form'

import { xhr } from '@/lib/http'
import { STATUS_TEXTS } from '@/lib/http-status-codes/en'
import type { LoginAPI, AuthTokenAPI } from '@/types/api'

const ACCESS_TOKEN_EXPIRES_IN = +process.env.ACCESS_TOKEN_EXPIRES_IN!
const ACCESS_TOKEN_EXPIRES_BEFORE = +process.env.ACCESS_TOKEN_EXPIRES_BEFORE!

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super()
    this.code = code
    this.message = code
    this.stack = undefined
  }
}

// You can put all common configuration here which does not rely on the adapter.
// Notice this is exporting a configuration object only, we’re not calling NextAuth() here.
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: {
        params: { access_type: 'offline', prompt: 'consent', response_type: 'code' },
      },
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
        rememberMe: {},
      },
      authorize: async (credentials) => {
        const { data, success } = loginFormSchema.safeParse({
          ...credentials,
          rememberMe: credentials?.rememberMe === 'true',
        })

        if (!success) {
          throw new CustomError(STATUS_TEXTS.BAD_REQUEST)
        }

        try {
          const {
            message,
            data: { user },
          } = await xhr.post<LoginAPI>('/api/auth/login', {
            body: JSON.stringify(data),
          })

          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          if (!user) throw new CustomError(message)

          // return user object with their profile data
          return user as User
        } catch (e: unknown) {
          throw new CustomError((e as Error)?.message)
        }
      },
    }),
    // [ERROR] Module not found: Can't resolve 'crypto'
    // Nodemailer({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }),
  ],
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    authorized: async ({ request, auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    signIn: async ({ account, profile }) => {
      if (account?.provider === 'google') return !!profile?.email_verified
      return true // Do different verification for other providers that don't have `email_verified`
    },
    jwt: async ({ token, user, account, profile, trigger, session }) => {
      const cookieStore = await cookies()
      const rememberMe = cookieStore.get('rememberMe')?.value === 'true'

      // By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
      if (user?.id) token.id = user.id

      // First-time login, save the `access_token`, its expiry and the `refresh_token`
      if (account && user) {
        return {
          ...token,
          type: account.type,
          provider: account.provider,
          access_token: account.provider === 'credentials' ? user.access_token : account.access_token,
          expires_at: account.provider === 'credentials' ? user.expires_at : account.expires_at,
          refresh_token: account.provider === 'credentials' ? user.refresh_token : account.refresh_token,
          username: user.username,
          plan: user.plan,
          role: user.role,
          isAdmin: user.isAdmin,
          isBan: user.isBan,
          bannedUntil: user.bannedUntil,
        } as JWT
      }

      // Subsequent logins, but the `access_token` is still valid
      if (Date.now() < (token.expires_at - ACCESS_TOKEN_EXPIRES_BEFORE) * 1000) return token

      // If do not remember me for 30 days, destroy the token
      if (!rememberMe) return null

      // Access token has expired, try to update it
      if (token?.provider === 'credentials') {
        token = await credentialsToken(token)
      } else if (token?.provider === 'google') {
        token = await googleToken(token)
      }

      return token?.error ? null : token
    },
    // By default, the `id` property does not exist on `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
    session: async ({ session, token }) => {
      const { access_token, error, ...jwt } = token
      return { ...session, user: { ...session.user, ...jwt, access_token }, access_token, error }
    },
  },
}

async function credentialsToken(token: JWT): Promise<JWT> {
  // Subsequent logins, but the `access_token` has expired, try to refresh it
  if (!token.refresh_token) {
    return { ...token, error: 'Missing refresh_token' }
  }

  try {
    const {
      message,
      data: { tokens },
    } = await xhr.post<AuthTokenAPI>('/api/auth/token', {
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    })

    if (!tokens) throw new Error(message)

    return { ...token, ...tokens }
  } catch (e: unknown) {
    // If we fail to refresh the token, return an error so we can handle it on the page
    return { ...token, error: 'RefreshTokenError' }
  }
}

async function googleToken(token: JWT): Promise<JWT> {
  // Subsequent logins, but the `access_token` has expired, try to refresh it
  if (!token.refresh_token) {
    return { ...token, error: 'Missing refresh_token' }
  }

  try {
    // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
    // at their `/.well-known/openid-configuration` endpoint.
    // i.e. https://accounts.google.com/.well-known/openid-configuration
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token,
      }),
    })

    const tokensOrError = await res.json()

    if (!res.ok) throw tokensOrError

    const newTokens = tokensOrError as {
      access_token: string
      expires_in: number
      refresh_token?: string
    }

    return {
      ...token,
      access_token: newTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
      // Some providers only issue refresh tokens once, so preserve if we did not get a new one
      refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
    }
  } catch (e: unknown) {
    // If we fail to refresh the token, return an error so we can handle it on the page
    return { ...token, error: 'RefreshTokenError' }
  }
}
