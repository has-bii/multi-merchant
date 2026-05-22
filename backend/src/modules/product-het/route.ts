import { ProductHetService } from "./service.js"
import { createApp } from "../../lib/typed-app.js"
import { requireAdmin, requireAuth } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { bulkDeleteSchema, getProductHetQuerySchema, productHetSchema } from "./schema.js"

export const crudRoute = createApp()
  .get("/", requireAuth, zValidator("query", getProductHetQuerySchema), async (c) => {
    return c.json(await ProductHetService.list(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    return c.json(await ProductHetService.getById(c.req.param("id")))
  })
  .post("/", requireAdmin, zValidator("json", productHetSchema), async (c) => {
    return c.json(await ProductHetService.create(c.req.valid("json")), 201)
  })
  .put("/:id", requireAdmin, zValidator("json", productHetSchema), async (c) => {
    return c.json(await ProductHetService.update(c.req.param("id"), c.req.valid("json")))
  })
  .delete("/:id", requireAdmin, async (c) => {
    await ProductHetService.delete(c.req.param("id"))
    return c.body(null, 204)
  })
  .post("/bulk-delete", requireAdmin, zValidator("json", bulkDeleteSchema), async (c) => {
    const { ids } = c.req.valid("json")
    await ProductHetService.bulkDelete(ids)
    return c.body(null, 204)
  })
