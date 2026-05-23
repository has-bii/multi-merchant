import { bodyLimit } from "hono/body-limit"

import { createApp } from "../../../lib/typed-app.js"
import { requireAdmin } from "../../../middlewares/auth.js"
import { zValidator } from "../../../middlewares/validator.js"
import { importExecutePayloadSchema, importPreviewSchema } from "./schema.js"
import { ProductHetImportService } from "./service.js"

const fileLimit = bodyLimit({
  maxSize: 5 * 1024 * 1024,
  onError: (c) => c.json({ message: "Ukuran file maksimal 5MB" }, 413),
})

export const importRoute = createApp()
  .post(
    "/import/preview",
    requireAdmin,
    fileLimit,
    zValidator("form", importPreviewSchema),
    async (c) => {
      const parsed = c.req.valid("form")

      return c.json(await ProductHetImportService.preview(parsed.file))
    },
  )
  .post(
    "/import/execute",
    requireAdmin,
    zValidator("json", importExecutePayloadSchema),
    async (c) => {
      return c.json(await ProductHetImportService.execute(c.req.valid("json")))
    },
  )
