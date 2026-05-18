import { inferAdditionalFields } from "better-auth/client/plugins"
import { admin } from "better-auth/plugins/admin"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    admin(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
  ],
})

export type User = typeof authClient.$Infer.Session.user
