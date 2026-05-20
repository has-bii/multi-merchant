import { z } from "zod/v4"

export const productHetFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama produk wajib diisi" })
    .transform((v) => v.trim().toLowerCase()),
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export type ProductHetFormValues = z.input<typeof productHetFormSchema>
export type ProductHetFormOutput = z.output<typeof productHetFormSchema>
