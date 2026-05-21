import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

export const merchantSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(1, { message: "Telepon wajib diisi" })
    .regex(/^08\d{8,12}$/, {
      message: "Nomor telepon harus diawali 08 dan panjang 10-14 karakter",
    }),
  address: z.string().min(1, { message: "Alamat wajib diisi" }),
  description: z.string().optional(),
})

export const getMerchantQuerySchema = querySchema.extend({
  name: z.string().optional(),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export interface MerchantListItem {
  id: string
  name: string
  address: string
  createdAt: string
}

export interface MerchantListResponse {
  data: MerchantListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MerchantDetailResponse {
  id: string
  name: string
  phone: string
  address: string
  description: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
}

export type GetMerchantQueryDto = z.infer<typeof getMerchantQuerySchema>
export type CreateMerchantDto = z.infer<typeof merchantSchema>
export type UpdateMerchantDto = z.infer<typeof merchantSchema>
