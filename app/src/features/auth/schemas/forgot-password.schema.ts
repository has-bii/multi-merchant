import { z } from "zod/v4"

export const forgotPasswordSchema = z.object({
  email: z.email("Email tidak valid"),
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>