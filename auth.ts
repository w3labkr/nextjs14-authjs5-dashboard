import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import type { User } from "@prisma/client"
import bcrypt from 'bcryptjs'

import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // authorization: {
      //   params: {
      //     prompt: 'consent'
      //   }
      // }
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user: User | null = null

        // logic to salt and hash password
        const password = credentials?.password as string
        const hashPassword = await bcrypt.hash(password, 10)

        // logic to verify if the user exists
        user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
            password: hashPassword
          }
        })

        console.log(user)

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return null
        }

        // return JSON object with the user data
        return user
      },
    })
  ],
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt", // "jwt" | "database"
    maxAge: 2592000, // 30 days
    updateAge: 86400 // 1 day
  },
})
