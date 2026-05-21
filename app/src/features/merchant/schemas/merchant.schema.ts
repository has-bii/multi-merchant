import { z } from "zod/v4"

export const merchantSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().default(""),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type MerchantSearch = z.infer<typeof merchantSearchSchema>
