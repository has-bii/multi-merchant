import { createAuthClient } from 'better-auth/react'
import { admin } from 'better-auth/plugins/admin'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [admin()],
})
