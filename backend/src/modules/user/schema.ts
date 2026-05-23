import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

export interface UserListItem {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export interface UserListResponse {
  data: UserListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getUserQuerySchema = querySchema.extend({
  search: z.string().optional(),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type GetUserQueryDto = z.infer<typeof getUserQuerySchema>
