import { zValidator as zv } from "@hono/zod-validator"
import type { ValidationTargets } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod/v4"

export const zValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new HTTPException(400, { cause: result.error })
    }
  })
