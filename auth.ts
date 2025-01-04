import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"
import { z } from "zod"

import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null

        // const { email, password } = await signInSchema.parseAsync(credentials)

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)

        console.log(credentials)
 
        // logic to verify if the user exists
        // user = await prisma.user.findUnique({
        //   where: { 
        //     email: credentials.email as string, 
        //     password: credentials.password as string
        //   }
        // })

        // if (!user) {
        //   // No user found, so this is their first attempt to login
        //   // Optionally, this is also the place you could do a user registration
        //   throw new Error("Invalid credentials.")
        // }
 
        // return JSON object with the user data
        return user
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 // 1 day
  },
})
