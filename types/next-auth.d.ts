import { type DefaultSession } from 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string
    type: string
    provider: string
    access_token: string
    expires_at: number
    refresh_token?: string
    username: string
    plan: string
    role: string
    isAdmin: boolean
    isBan: boolean
    bannedUntil?: Date
  }

  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
    access_token: string
    error?: string
  }
}

// Auth.js uses camelCase for its database rows while respecting the conventional snake_case formatting for OAuth-related values.
// If the mixed casing is an issue for you, most adapters have a dedicated documentation section on how to force a casing convention.
declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    type: string
    provider: string
    access_token: string
    expires_at: number
    refresh_token?: string
    username: string
    plan: string
    role: string
    isAdmin: boolean
    isBan: boolean
    bannedUntil?: Date
    error?: string
  }
}
