import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { env } from "./config/env.js"
import { auth } from "./lib/auth.js"
import productHets from "./routes/product-het.js"

const app = new Hono().basePath("/api")

app.use(logger())

app.use(
  "*",
  cors({
    origin: [env.CORS.ORIGIN_ADMIN, env.CORS.ORIGIN_CLIENT],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" })
})

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

app.route("/product-het", productHets)

export default app
