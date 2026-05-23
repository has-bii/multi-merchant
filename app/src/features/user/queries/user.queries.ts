import { queryOptions } from "@tanstack/react-query"

import { userClient } from "@/lib/api/user"
import type { UserListResponse } from "backend/user"

import type { UserSearch } from "../schemas/user.schema"

export const userKeys = {
  all: ["user"] as const,
  list: (params: UserSearch) =>
    [...userKeys.all, "list", params] as const,
}

export function getUserQueryOptions(params: UserSearch) {
  return queryOptions({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await userClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          orderBy: params.orderBy,
          order: params.order,
          ...(params.search ? { search: params.search } : {}),
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data pengguna")
      return (await res.json()) as unknown as UserListResponse
    },
  })
}
