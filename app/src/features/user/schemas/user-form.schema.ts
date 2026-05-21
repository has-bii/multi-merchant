import { z } from "zod/v4"

export const userFormSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  email: z.email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  role: z.enum(["admin", "user"], { message: "Role tidak valid" }),
})

export type UserFormValues = z.input<typeof userFormSchema>
export type UserFormOutput = z.output<typeof userFormSchema>
