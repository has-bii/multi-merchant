/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { productHetClient } from "@/lib/api/product-het"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteProductHet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await productHetClient[":id"].$delete({ param: { id } })
      if (!res.ok) throw new Error("Gagal menghapus produk")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
    },
  })
}

export function useBulkDeleteProductHet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await productHetClient["bulk-delete"].$post({ json: { ids } })
      if (!res.ok) throw new Error("Gagal menghapus produk")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
    },
  })
}
