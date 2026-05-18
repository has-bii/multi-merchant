import { Hono } from "hono"

import productHets from "./routes/product-het.js"
import products from "./routes/products.js"

const app = new Hono().basePath("/api")

app.get("/", (c) => {
  return c.json({ message: "Hello, World!" })
})

app.route("/products", products)
app.route("/product-het", productHets)

export default app
