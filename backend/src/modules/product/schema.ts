import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

export const createProductSchema = z.object({
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
  productHetId: z.string().uuid({ message: "Product HET tidak valid" }),
})

export const updateProductSchema = z.object({
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export const getProductQuerySchema = querySchema.extend({
  name: z.string().optional(),
  productHetId: z.string().uuid().optional(),
  orderBy: z.enum(["createdAt", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateProductDto = z.infer<typeof createProductSchema>
export type UpdateProductDto = z.infer<typeof updateProductSchema>
export type GetProductQueryDto = z.infer<typeof getProductQuerySchema>
