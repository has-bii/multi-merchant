import { productHetClient } from "@/lib/api/product-het"
import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { productHetFormSchema } from "../schemas/product-het-form.schema"

interface UseProductHetFormOptions {
  initialData?: {
    id: string
    name: string
    price: number
  }
}

export function useProductHetForm({ initialData }: UseProductHetFormOptions = {}) {
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isEdit = !!initialData

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; price: number }) => {
      const res = await productHetClient.index.$post({ json: data })
      if (!res.ok) throw new Error("Gagal membuat produk HET")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
      navigate({ to: "/admin/produk-het" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; price: number }) => {
      const res = await productHetClient[":id"].$put({
        param: { id: initialData!.id },
        json: data,
      })
      if (!res.ok) throw new Error("Gagal memperbarui produk HET")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
      navigate({ to: "/admin/produk-het" })
    },
  })

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData?.price != null ? String(initialData.price) : "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = productHetFormSchema.safeParse(value)
        if (!result.success) return result.error.issues.map((i) => i.message)
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const parsed = productHetFormSchema.parse(value)

        if (isEdit) {
          await updateMutation.mutateAsync(parsed)
        } else {
          await createMutation.mutateAsync(parsed)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error, isEdit }
}
