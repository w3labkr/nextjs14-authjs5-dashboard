import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import { z } from 'zod'

import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import { fetcher } from '@/lib/utils'
import { SignInAPI } from '@/types/api'

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
export default {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  providers: [
    Google({
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: {
        params: { prompt: 'consent', access_type: 'offline', response_type: 'code' },
      },
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedField = z
          .object({
            email: z.string().max(255).email(),
            password: z.string().min(6).max(72),
          })
          .safeParse(credentials)

        if (!validatedField.success) return null

        const {
          success,
          message,
          data: { user },
        } = await fetcher<SignInAPI>('/api/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedField.data),
        })

        if (!success) throw new CustomError(message)

        // No user found, so this is their first attempt to login
        // Optionally, this is also the place you could do a user registration
        if (!user) throw new CustomError(message)

        // return user object with their profile data
        return user
      },
    }),
  ],
  //  By default, the `id` property does not exist on `token` or `session`. See the [TypeScript](https://authjs.dev/getting-started/typescript) on how to add it.
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    signIn: async ({ account, profile }) => {
      if (account?.provider === 'google') return !!profile?.email_verified
      return true // Do different verification for other providers that don't have `email_verified`
    },
    jwt: async ({ token, user }) => {
      console.log({ token, user })
      // if (user.id) token.id = user.id
      return token
    },
    session: async ({ session, token }) => {
      session.accessToken = token.accessToken
      console.log({ session })
      // if (token.id) session.id = token.id
      return session
    },
  },
} satisfies NextAuthConfig
