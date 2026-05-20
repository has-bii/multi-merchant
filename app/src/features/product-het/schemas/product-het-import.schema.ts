import { z } from "zod/v4"

const editablePriceSchema = z.coerce
  .number<number>()
  .int({ message: "Harga harus bilangan bulat" })
  .positive({ message: "Harga harus lebih dari 0" })

export const importFormSchema = z
  .object({
    willCreate: z.array(
      z.object({
        row: z.number(),
        name: z.string(),
        price: editablePriceSchema,
        selected: z.boolean(),
      }),
    ),
    willUpdate: z.array(
      z.object({
        row: z.number(),
        id: z.uuid(),
        name: z.string(),
        oldPrice: z.number(),
        price: editablePriceSchema,
        selected: z.boolean(),
      }),
    ),
  })
  .refine((values) => {
    const isCreateNotEmpty = values.willCreate.some((f) => f.selected)
    const isUpdateNotEmpty = values.willUpdate.some((f) => f.selected)

    return isCreateNotEmpty || isUpdateNotEmpty
  })

export type ImportFormValues = z.infer<typeof importFormSchema>
