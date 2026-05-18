import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"

import { resetPasswordSchema } from "../schemas/reset-password.schema"

export const useResetPasswordForm = (token: string) => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setError("")
        setSuccess(false)

        const { error: err } = await authClient.resetPassword({
          newPassword: value.password,
          token,
        })

        if (err) {
          throw new Error(err.message || "Gagal mereset password")
        }

        setSuccess(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi Kesalahan")
      } finally {
        formApi.reset()
      }
    },
  })

  return { form, error, success }
}