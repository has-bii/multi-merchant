import { DataTablePagination } from "@/components/data-table-pagination"
import { UserDeleteDialog } from "@/features/user/components/user-delete-dialog"
import { UserTable } from "@/features/user/components/user-table"
import { useDeleteUser } from "@/features/user/hooks/use-user-delete"
import { getUserQueryOptions } from "@/features/user/queries/user.queries"
import type { UserSearch } from "@/features/user/schemas/user.schema"
import { useListState } from "@/hooks/use-list-state"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

export function UserListContent() {
  const searchParams = useSearch({ from: "/_authenticated/admin/pengguna/" })
  const navigate = useNavigate({ from: "/admin/pengguna/" })

  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getUserQueryOptions(searchParams))

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
  })

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const deleteMutation = useDeleteUser()

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getUserQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: UserSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => {
        toast.success("Pengguna berhasil dihapus")
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(err.message)
        setDeleteTarget(null)
      },
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <UserTable
        data={data.data}
        searchParams={params}
        onSortChange={toggleSort}
        onDelete={(id) => setDeleteTarget(id)}
      />

      <DataTablePagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        total={data.pagination.total}
        limit={params.limit}
        onPageChange={(page) => update({ page })}
        onLimitChange={(limit) => update({ limit })}
      />

      <UserDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
