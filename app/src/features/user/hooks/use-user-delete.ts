import { userKeys } from "@/features/user/queries/user.queries"
import { userClient } from "@/lib/api/user"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await userClient[":id"].$delete({ param: { id } })
      if (!res.ok) {
        const text = await res.text().catch(() => "Gagal menghapus pengguna")
        throw new Error(text)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
