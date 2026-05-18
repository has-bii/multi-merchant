import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { neon } from "@neondatabase/serverless"
import { betterAuth } from "better-auth/minimal"
import { admin } from "better-auth/plugins"
import { drizzle } from "drizzle-orm/neon-http"

import { env } from "../config/env.js"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({ client: sql })

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
  },
  plugins: [admin()],
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
