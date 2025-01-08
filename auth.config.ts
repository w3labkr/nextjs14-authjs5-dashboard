import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google],
} satisfies NextAuthConfig

// Credentials({
//   name: "Credentials",
//   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//   // e.g. domain, username, password, 2FA token, etc.
//   credentials: { email: {}, password: {}, },
//   authorize: async (credentials, request) => {
//     return null
//   },
// })
