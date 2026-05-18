import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { Hono } from "hono"

import { productHets } from "../db/schema.js"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle({
  client: sql,
  schema: {
    productHets,
  },
})

const route = new Hono()

route.get("/", async (c) => {
  const data = await db.query.productHets.findMany()

  return c.json(data)
})

export default route
