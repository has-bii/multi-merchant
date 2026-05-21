import { z } from "zod/v4"

export const userSearchSchema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type UserSearch = z.infer<typeof userSearchSchema>
