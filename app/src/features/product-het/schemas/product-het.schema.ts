import { z } from "zod/v4"

export const productHetSearchSchema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["name", "price", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type ProductHetSearch = z.infer<typeof productHetSearchSchema>
