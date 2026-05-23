import { Hono } from "hono"

import type { AuthType } from "./auth.js"

export function createApp() {
  return new Hono<{ Variables: AuthType }>()
}
