import { Hono } from "hono"

import { db } from "../lib/db.js"

const route = new Hono()

route.get("/", async (c) => {
  const data = await db.query.productHets.findMany()

  return c.json(data)
})

export default route
