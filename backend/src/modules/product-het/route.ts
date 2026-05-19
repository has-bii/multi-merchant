import * as service from "./service.js"
import { createApp } from "../../lib/typed-app.js"
import { requireAdmin, requireAuth } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { getProductHetQuerySchema, productHetSchema } from "./schema.js"

export const crudRoute = createApp()
  .get("/", requireAuth, zValidator("query", getProductHetQuerySchema), async (c) => {
    return c.json(await service.listProducts(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    return c.json(await service.getProduct(c.req.param("id")))
  })
  .post("/", requireAdmin, zValidator("json", productHetSchema), async (c) => {
    return c.json(await service.createProduct(c.req.valid("json")), 201)
  })
  .put("/:id", requireAdmin, zValidator("json", productHetSchema), async (c) => {
    return c.json(await service.updateProduct(c.req.param("id"), c.req.valid("json")))
  })
  .delete("/:id", requireAdmin, async (c) => {
    await service.deleteProduct(c.req.param("id"))
    return c.body(null, 204)
  })