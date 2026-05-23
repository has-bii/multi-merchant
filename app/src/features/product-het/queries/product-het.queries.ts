import { queryOptions } from "@tanstack/react-query"

import { productHetClient } from "@/lib/api/product-het"
import type { ProductHetListResponse, ProductHetListItem } from "backend/product-het"

import type { ProductHetSearch } from "../schemas/product-het.schema"

export const productHetKeys = {
  all: ["product-het"] as const,
  list: (params: ProductHetSearch) =>
    [...productHetKeys.all, "list", params] as const,
}

export function getProductHetByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: [...productHetKeys.all, "detail", id],
    queryFn: async () => {
      const res = await productHetClient[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail produk HET")
      const data = (await res.json()) as ProductHetListItem
      return { ...data, price: Number(data.price) }
    },
  })
}

export function getProductHetQueryOptions(params: ProductHetSearch) {
  return queryOptions({
    queryKey: productHetKeys.list(params),
    queryFn: async () => {
      const res = await productHetClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          orderBy: params.orderBy,
          order: params.order,
          ...(params.search ? { search: params.search } : {}),
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data produk HET")
      return (await res.json()) as unknown as ProductHetListResponse
    },
  })
}
