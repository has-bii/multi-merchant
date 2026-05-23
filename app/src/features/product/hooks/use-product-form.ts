/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { productKeys } from "@/features/product/queries/product.queries"
import { productClient } from "@/lib/api/product"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { productCreateFormSchema } from "../schemas/product-form.schema"

interface UseProductFormOptions {
  initialData?: {
    id: string
    productHetId: string
    price: number
  }
}

export function useProductForm({ initialData }: UseProductFormOptions = {}) {
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isEdit = !!initialData

  const createMutation = useMutation({
    mutationFn: async (data: { productHetId: string; price: number }) => {
      const res = await productClient.index.$post({ json: data })
      if (!res.ok) {
        const errMessage = await res.text().catch(() => "Gagal membuat produk")
        throw new Error(errMessage)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      navigate({ to: "/user/produk" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { price: number }) => {
      const res = await productClient[":id"].$put({
        param: { id: initialData!.id },
        json: data,
      })
      if (!res.ok) throw new Error("Gagal memperbarui produk")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      navigate({ to: "/user/produk" })
    },
  })

  const form = useForm({
    defaultValues: {
      productHetId: initialData?.productHetId ?? "",
      price: initialData?.price ?? 0,
    },
    validators: {
      onSubmit: productCreateFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")

        if (isEdit) {
          await updateMutation.mutateAsync({ price: value.price })
        } else {
          await createMutation.mutateAsync({
            productHetId: value.productHetId,
            price: value.price,
          })
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error, isEdit }
}
