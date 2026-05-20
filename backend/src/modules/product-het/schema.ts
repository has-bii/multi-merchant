import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

/** API contract type for a single Product HET row in list responses.
 *  Mirrors the JSON shape after Drizzle → Hono serialization. */
export interface ProductHetListItem {
  id: string
  name: string
  price: string
  createdAt: string
  updatedAt: string
}

export interface ProductHetListResponse {
  data: ProductHetListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const productHetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama produk wajib diisi" })
    .transform((v) => v.trim().toLowerCase()),
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export const getProductHetQuerySchema = querySchema.extend({
  search: z.string().optional(),
  orderBy: z.enum(["name", "price", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, { message: "Pilih minimal 1 produk" }),
})

export type ProductHetDto = z.infer<typeof productHetSchema>
export type GetProductHetQueryDto = z.infer<typeof getProductHetQuerySchema>
