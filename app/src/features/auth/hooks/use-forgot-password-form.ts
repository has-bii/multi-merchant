import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"

import { forgotPasswordSchema } from "../schemas/forgot-password.schema"

const RESET_PASSWORD_URL = `${window.location.origin}/reset-password`

export const useForgotPasswordForm = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: forgotPasswordSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setError("")
        setSuccess(false)

        const { error: err } = await authClient.requestPasswordReset({
          email: value.email,
          redirectTo: RESET_PASSWORD_URL,
        })

        if (err) {
          throw new Error(err.message || "Gagal mengirim email reset password")
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