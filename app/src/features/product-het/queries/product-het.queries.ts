import { queryOptions } from "@tanstack/react-query"

import { productHetClient } from "@/lib/api/product-het"

import type { ProductHetSearch } from "../schemas/product-het.schema"

export const productHetKeys = {
  all: ["product-het"] as const,
  list: (params: ProductHetSearch) => [...productHetKeys.all, "list", params] as const,
}

function fetchProductHetList(params: ProductHetSearch) {
  return productHetClient.index.$get({
    query: {
      page: String(params.page),
      limit: String(params.limit),
      orderBy: params.orderBy,
      order: params.order,
      ...(params.search ? { search: params.search } : {}),
    },
  })
}

export function getProductHetQueryOptions(params: ProductHetSearch) {
  return queryOptions({
    queryKey: productHetKeys.list(params),
    queryFn: async () => {
      const res = await fetchProductHetList(params)
      if (!res.ok) throw new Error("Gagal memuat data produk HET")
      return res.json()
    },
  })
}

