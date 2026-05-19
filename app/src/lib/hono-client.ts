import type { Hono } from "hono"
import { hc } from "hono/client"

const API_BASE_URL = import.meta.env.VITE_API_URL

export function createHonoClient<T extends Hono<any, any, any>>(path: string) {
  return hc<T>(`${API_BASE_URL}${path}`, {
    init: {
      credentials: "include",
    },
  })
}
