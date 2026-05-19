import { z } from "zod/v4"

export const importPreviewRowSchema = z.object({
  row: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().int().positive(),
})

export const importExecuteWillUpdateSchema = importPreviewRowSchema.extend({
  id: z.uuid(),
})

export const importExecutePayloadSchema = z.object({
  willCreate: z.array(importPreviewRowSchema),
  willUpdate: z.array(importExecuteWillUpdateSchema),
})

export type ImportPreviewRow = z.infer<typeof importPreviewRowSchema>
export type ImportExecutePayloadDto = z.infer<typeof importExecutePayloadSchema>