import { z } from "zod/v4"

export const merchantSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().default(""),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type MerchantSearch = z.infer<typeof merchantSearchSchema>

export const merchantFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .min(1, "Telepon wajib diisi")
    .regex(/^08\d{8,12}$/, "Nomor telepon harus diawali 08 dan panjang 10-14 karakter"),
  address: z.string().min(1, "Alamat wajib diisi"),
  description: z.string(),
})

export type MerchantFormValues = z.infer<typeof merchantFormSchema>
