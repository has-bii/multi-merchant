import { bodyLimit } from "hono/body-limit"
import { HTTPException } from "hono/http-exception"

import * as service from "./service.js"
import { createApp } from "../../../lib/typed-app.js"
import { requireAdmin } from "../../../middlewares/auth.js"
import { zValidator } from "../../../middlewares/validator.js"
import { importExecutePayloadSchema } from "./schema.js"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const fileLimit = bodyLimit({
  maxSize: MAX_FILE_SIZE,
  onError: (c) => c.json({ message: "Ukuran file maksimal 5MB" }, 413),
})

export const importRoute = createApp()
  .post("/import/preview", requireAdmin, fileLimit, async (c) => {
    const body = await c.req.parseBody()
    const file = body["file"]

    if (!file || !(file instanceof File)) {
      throw new HTTPException(400, { message: "File wajib dikirim" })
    }

    return c.json(await service.previewImportProduct(file))
  })
  .post(
    "/import/execute",
    requireAdmin,
    zValidator("json", importExecutePayloadSchema),
    async (c) => {
      return c.json(await service.executeImportProduct(c.req.valid("json")))
    },
  )