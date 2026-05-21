import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { productHetClient } from "@/lib/api/product-het"

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
      price: initialData?.price ?? 0,
    },
    validators: {
      onSubmit: productHetFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")

        if (isEdit) {
          await updateMutation.mutateAsync(value)
        } else {
          await createMutation.mutateAsync(value)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error, isEdit }
}
