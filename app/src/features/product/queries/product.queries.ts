import { queryOptions } from "@tanstack/react-query"
import { productClient } from "@/lib/api/product"
import type { ProductSearch } from "../schemas/product.schema"

export type ProductListItem = {
  id: string
  price: string
  createdAt: string
  updatedAt: string
  productHetId: string
  productHet: { id: string; name: string; price: string }
  merchant: { id: string; name: string }
}

export type ProductListResponse = {
  data: ProductListItem[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const productKeys = {
  all: ["product"] as const,
  list: (params: ProductSearch) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  available: () => [...productKeys.all, "available"] as const,
}

export function getProductQueryOptions(params: ProductSearch) {
  return queryOptions({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const res = await productClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          orderBy: params.orderBy,
          order: params.order,
          ...(params.search ? { name: params.search } : {}),
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data produk")
      return (await res.json()) as ProductListResponse
    },
  })
}

export function getProductByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await productClient.detail[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail produk")
      return res.json()
    },
  })
}

export function getAvailableProductsQueryOptions() {
  return queryOptions({
    queryKey: productKeys.available(),
    queryFn: async () => {
      const res = await productClient.available.$get()
      if (!res.ok) throw new Error("Gagal memuat produk tersedia")
      return res.json()
    },
  })
}
