import { z } from "zod/v4"

export const productCreateFormSchema = z.object({
  productHetId: z.string().uuid({ message: "Produk HET tidak valid" }),
  price: z
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export const productEditFormSchema = z.object({
  price: z
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export type ProductCreateFormValues = z.input<typeof productCreateFormSchema>
export type ProductEditFormValues = z.input<typeof productEditFormSchema>
