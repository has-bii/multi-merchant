import { z } from "zod/v4"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FORMATS = ["text/csv", "text/csv-schema"]

export const importPreviewSchema = z.object({
  file: z
    .file()
    .refine((f) => f.size <= MAX_FILE_SIZE, "Ukuran file maksimal 5MB")
    .refine((f) => ACCEPTED_FORMATS.includes(f.type), "Format file harus .csv"),
})

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
