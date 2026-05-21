import { userKeys } from "@/features/user/queries/user.queries"
import { userClient } from "@/lib/api/user"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await userClient[":id"].$delete({ param: { id } })
      if (!res.ok) throw new Error("Gagal menghapus pengguna")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}
