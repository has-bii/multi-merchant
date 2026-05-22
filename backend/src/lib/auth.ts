import { prismaAdapter } from "better-auth/adapters/prisma"
import { betterAuth } from "better-auth/minimal"
import { admin } from "better-auth/plugins"

import { env } from "../config/env.js"
import { db } from "./db.js"
import { sendPasswordResetEmail } from "./email.js"

export const auth = betterAuth({
  secret: env.AUTH.SECRET,
  baseURL: env.AUTH.URL,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async ({ user, url, token }) => {
      if (env.NODE_ENV === "production") {
        void sendPasswordResetEmail({ to: user.email, resetUrl: url })
      } else {
        console.log(`[dev] Reset password for ${user.email}: ${url} (token: ${token})`)
      }
    },
    revokeSessionsOnPasswordReset: true,
  },
  advanced: {
    database: {
      generateId: false,
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: env.AUTH.DOMAIN,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300,
      strategy: "compact",
    },
  },
  trustedOrigins: [env.CORS.ORIGIN_ADMIN, env.CORS.ORIGIN_CLIENT],
  plugins: [admin()],
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
