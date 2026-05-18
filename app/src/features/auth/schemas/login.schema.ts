import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

export type LoginDto = z.infer<typeof loginSchema>
