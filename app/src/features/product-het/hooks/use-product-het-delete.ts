import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { productHetClient } from "@/lib/api/product-het"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteProductHet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (idOrIds: string | string[]) => {
      if (typeof idOrIds === "string") {
        const res = await productHetClient[":id"].$delete({ param: { id: idOrIds } })
        if (!res.ok) throw new Error("Gagal menghapus produk")
      } else {
        const res = await productHetClient["bulk-delete"].$post({ json: { ids: idOrIds } })
        if (!res.ok) throw new Error("Gagal menghapus produk")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
    },
  })
}
