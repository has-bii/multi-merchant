import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

import type { AuthType } from "../lib/auth.js"

export const requireAuth = createMiddleware<{ Variables: AuthType }>(async (c, next) => {
  const user = c.get("user")
  if (!user) {
    throw new HTTPException(401, { message: "Silakan login terlebih dahulu" })
  }
  await next()
})

export const requireAdmin = createMiddleware<{ Variables: AuthType }>(async (c, next) => {
  const user = c.get("user")
  if (!user) {
    throw new HTTPException(401, { message: "Silakan login terlebih dahulu" })
  }
  if (user.role !== "admin") {
    throw new HTTPException(403, { message: "Akses ditolak" })
  }
  await next()
})