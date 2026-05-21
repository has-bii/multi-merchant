import { merchantClient } from "@/lib/api/merchant"

import { queryOptions, useMutation } from "@tanstack/react-query"

import type { MerchantFormValues, MerchantSearch } from "../schemas/merchant.schema"

export const merchantKeys = {
  all: ["merchant"] as const,
  list: (params: MerchantSearch) => [...merchantKeys.all, "list", params] as const,
  detail: (id: string) => [...merchantKeys.all, "detail", id] as const,
  byUser: () => [...merchantKeys.all, "byUser"] as const,
}

export function getMerchantListQueryOptions(params: MerchantSearch) {
  return queryOptions({
    queryKey: merchantKeys.list(params),
    queryFn: async () => {
      const res = await merchantClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          orderBy: params.orderBy,
          order: params.order,
          ...(params.name ? { name: params.name } : {}),
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data merchant")
      return await res.json()
    },
  })
}

export function getMerchantDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: merchantKeys.detail(id),
    queryFn: async () => {
      const res = await merchantClient[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail merchant")
      return await res.json()
    },
  })
}

export function getMerchantByUserQueryOptions() {
  return queryOptions({
    queryKey: merchantKeys.byUser(),
    queryFn: async () => {
      const res = await merchantClient[":id"].$get({ param: { id: "me" } })
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error("Gagal memuat data merchant")
      }
      return await res.json()
    },
  })
}

export function useCreateMerchantMutation() {
  return useMutation({
    mutationFn: async (data: MerchantFormValues) => {
      const res = await merchantClient.index.$post({ json: data })
      return res.json()
    },
    onSuccess: () => {
      // Invalidate query is handled on step-success.tsx
      // queryClient.invalidateQueries({ queryKey: merchantKeys.byUser() })
    },
  })
}
