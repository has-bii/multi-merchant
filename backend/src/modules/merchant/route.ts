import { MerchantService } from "./service.js"
import { createApp } from "../../lib/typed-app.js"
import { requireAdmin, requireAuth, requireUser } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { getMerchantQuerySchema, merchantSchema } from "./schema.js"

export const crudRoute = createApp()
  .get("/", requireAdmin, zValidator("query", getMerchantQuerySchema), async (c) => {
    return c.json(await MerchantService.list(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id")
    if (id !== "me" && c.get("user")!.role !== "admin") {
      return c.json({ message: "Akses ditolak" }, 403)
    }
    return c.json(await MerchantService.getById(id, c.get("user")!.id))
  })
  .post("/", requireUser, zValidator("json", merchantSchema), async (c) => {
    return c.json(await MerchantService.create(c.req.valid("json"), c.get("user")!.id), 201)
  })
  .put("/", requireUser, zValidator("json", merchantSchema), async (c) => {
    return c.json(await MerchantService.update(c.req.valid("json"), c.get("user")!.id))
  })
