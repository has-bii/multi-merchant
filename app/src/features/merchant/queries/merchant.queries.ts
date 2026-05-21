import { queryOptions } from "@tanstack/react-query"

import { merchantClient } from "@/lib/api/merchant"
import type { MerchantDetailResponse, MerchantListResponse } from "backend/merchant"

import type { MerchantSearch } from "../schemas/merchant.schema"

export const merchantKeys = {
  all: ["merchant"] as const,
  list: (params: MerchantSearch) => [...merchantKeys.all, "list", params] as const,
  detail: (id: string) => [...merchantKeys.all, "detail", id] as const,
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
      return (await res.json()) as MerchantListResponse
    },
  })
}

export function getMerchantDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: merchantKeys.detail(id),
    queryFn: async () => {
      const res = await merchantClient[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail merchant")
      return (await res.json()) as MerchantDetailResponse
    },
  })
}
