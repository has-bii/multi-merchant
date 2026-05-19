import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

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

export type ProductHetDto = z.infer<typeof productHetSchema>
export type GetProductHetQueryDto = z.infer<typeof getProductHetQuerySchema>