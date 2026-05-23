import { productKeys } from "@/features/product/queries/product.queries"
import { productClient } from "@/lib/api/product"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await productClient[":id"].$delete({ param: { id } })
      if (!res.ok) throw new Error("Gagal menghapus produk")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
