import { authClient } from "@/lib/auth-client"
import { useForm } from "@tanstack/react-form"
import { useState } from "react"

import { loginSchema } from "../schemas/login.schema"

export const useLoginForm = () => {
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setError("")
        const { error: err } = await authClient.signIn.email({
          ...value,
        })

        if (err) {
          throw new Error(err.message || "Gagal Masuk")
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi Kesalahan")
      } finally {
        formApi.reset()
      }
    },
  })

  return { form, error }
}
