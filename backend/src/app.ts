import { Hono } from "hono"
import { logger } from "hono/logger"

import productHets from "./routes/product-het.js"

const app = new Hono().basePath("/api")

app.use(logger())

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" })
})

app.route("/product-het", productHets)

export default app
