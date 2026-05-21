import { authClient } from "@/lib/auth-client"
import { userKeys } from "@/features/user/queries/user.queries"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { userFormSchema } from "../schemas/user-form.schema"

export function useUserForm() {
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user" as "admin" | "user",
    },
    validators: {
      onSubmit: userFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")

        const { data, error: authError } = await authClient.admin.createUser({
          email: value.email,
          password: value.password,
          name: value.name,
          role: value.role,
        })

        if (authError) {
          throw new Error(authError.message || "Gagal membuat pengguna")
        }

        if (!data) {
          throw new Error("Gagal membuat pengguna")
        }

        queryClient.invalidateQueries({ queryKey: userKeys.all })
        navigate({ to: "/admin/pengguna" })
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error }
}
