import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { env } from "./config/env.js"
import { type AuthType, auth } from "./lib/auth.js"
import { sessionMiddleware } from "./middlewares/session.js"
import { productHetRoute } from "./modules/product-het/index.js"
import { userRoute } from "./modules/user/index.js"

const app = new Hono<{ Variables: AuthType }>().basePath("/api")

app.use(logger())

app.use(
  "*",
  cors({
    origin: [env.CORS.ORIGIN_ADMIN, env.CORS.ORIGIN_CLIENT],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
)

// Auth handler — no session middleware
app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw)
})

// Protected routes — session middleware applies
const api = new Hono<{ Variables: AuthType }>()
api.use("*", sessionMiddleware)
api.route("/product-het", productHetRoute)
api.route("/user", userRoute)

app.route("/", api)

export default app