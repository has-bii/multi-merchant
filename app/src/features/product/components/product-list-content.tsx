import { DataTablePagination } from "@/components/data-table-pagination"
import { ProductDeleteDialog } from "@/features/product/components/product-delete-dialog"
import { ProductTable } from "@/features/product/components/product-table"
import { useDeleteProduct } from "@/features/product/hooks/use-product-delete"
import { getProductQueryOptions } from "@/features/product/queries/product.queries"
import type { ProductSearch } from "@/features/product/schemas/product.schema"
import { useListState } from "@/hooks/use-list-state"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "sonner"

export function ProductListContent() {
  const searchParams = useSearch({ from: "/_authenticated/user/produk/" })
  const navigate = useNavigate({ from: "/user/produk/" })

  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getProductQueryOptions(searchParams))

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
  })

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const deleteMutation = useDeleteProduct()

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getProductQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: ProductSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  const handleDelete = (id: string) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = () => {
    if (!deleteId) return

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Produk berhasil dihapus")
        setDeleteId(null)
      },
      onError: (err) => {
        toast.error(err.message)
        setDeleteId(null)
      },
    })
  }

  return (
    <div className="space-y-4">
      <ProductTable
        data={data.data}
        searchParams={params}
        onSortChange={toggleSort}
        onDelete={handleDelete}
      />

      <DataTablePagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        total={data.pagination.total}
        limit={params.limit}
        onPageChange={(page) => update({ page })}
        onLimitChange={(limit) => update({ limit })}
      />

      <ProductDeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}
