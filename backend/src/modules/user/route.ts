import { createApp } from "../../lib/typed-app.js"
import { requireAdmin } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { getUserQuerySchema } from "./schema.js"
import { UserService } from "./service.js"

export const crudRoute = createApp()
  .get("/", requireAdmin, zValidator("query", getUserQuerySchema), async (c) => {
    return c.json(await UserService.list(c.req.valid("query")))
  })
  .delete("/:id", requireAdmin, async (c) => {
    await UserService.delete(c.req.param("id"), c.get("user")!.id)
    return c.body(null, 204)
  })
