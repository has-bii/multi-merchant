import { Hono } from "hono"

const app = new Hono()

app.get("/", async (c) => {
  const products = [
    {
      id: "1",
      name: "Product 1",
      price: 100,
    },
    {
      id: "2",
      name: "Product 2",
      price: 200,
    },
  ]

  return c.json(products)
})

export default app
