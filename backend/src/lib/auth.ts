import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth/minimal"
import { admin } from "better-auth/plugins"

import { env } from "../config/env.js"
import { db } from "./db.js"

export const auth = betterAuth({
  secret: env.AUTH.SECRET,
  baseURL: env.AUTH.URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    camelCase: true,
  }),
  emailAndPassword: {
    enabled: true,
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
