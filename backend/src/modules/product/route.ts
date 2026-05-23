import { createApp } from "../../lib/typed-app.js"
import { requireAuth, requireUser } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { createProductSchema, getProductQuerySchema, updateProductSchema } from "./schema.js"
import { ProductService } from "./service.js"

export const crudRoute = createApp()
  .get("/", requireAuth, zValidator("query", getProductQuerySchema), async (c) => {
    const user = c.get("user")!
    return c.json(await ProductService.list(c.req.valid("query"), user.id, user.role ?? undefined))
  })
  .get("/available", requireUser, async (c) => {
    const user = c.get("user")!
    return c.json(await ProductService.getAvailable(user.id))
  })
  .get("/detail/:id", requireAuth, async (c) => {
    const user = c.get("user")!
    return c.json(await ProductService.getById(c.req.param("id"), user.id, user.role ?? undefined))
  })
  .post("/", requireUser, zValidator("json", createProductSchema), async (c) => {
    const user = c.get("user")!
    await ProductService.create(c.req.valid("json"), user.id)
    return c.body(null, 201)
  })
  .put("/:id", requireUser, zValidator("json", updateProductSchema), async (c) => {
    const user = c.get("user")!
    await ProductService.update(c.req.param("id"), c.req.valid("json"), user.id, user.role!)
    return c.body(null, 200)
  })
  .delete("/:id", requireUser, async (c) => {
    const user = c.get("user")!
    await ProductService.delete(c.req.param("id"), user.id, user.role!)
    return c.body(null, 204)
  })
