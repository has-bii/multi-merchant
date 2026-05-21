import { DataTablePagination } from "@/components/data-table-pagination"
import { Button } from "@/components/ui/button"
import { ProductHetDeleteDialog } from "@/features/product-het/components/product-het-delete-dialog"
import { ProductHetTable } from "@/features/product-het/components/product-het-table"
import { useDeleteProductHet } from "@/features/product-het/hooks/use-product-het-delete"
import { useProductHetSelection } from "@/features/product-het/hooks/use-product-het-selection"
import { getProductHetQueryOptions } from "@/features/product-het/queries/product-het.queries"
import type { ProductHetSearch } from "@/features/product-het/schemas/product-het.schema"
import { useListState } from "@/hooks/use-list-state"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type DeleteTarget =
  | { type: "single"; id: string }
  | { type: "bulk" }

export function ProductHetListContent() {
  const searchParams = useSearch({ from: "/_authenticated/admin/produk-het/" })
  const navigate = useNavigate({ from: "/admin/produk-het/" })

  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getProductHetQueryOptions(searchParams))

  const { selectedIds, toggleSelect, toggleAll, removeSelected, clearSelection } =
    useProductHetSelection(data.data)

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
    onReset: clearSelection,
  })

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const deleteMutation = useDeleteProductHet()

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getProductHetQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: ProductHetSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  const handleSingleDelete = (id: string) => {
    setDeleteTarget({ type: "single", id })
  }

  const handleBulkDelete = () => {
    setDeleteTarget({ type: "bulk" })
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === "single") {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Produk berhasil dihapus")
          removeSelected(deleteTarget.id)
          setDeleteTarget(null)
        },
        onError: (err) => {
          toast.error(err.message)
          setDeleteTarget(null)
        },
      })
    } else {
      const ids = Array.from(selectedIds)
      deleteMutation.mutate(ids, {
        onSuccess: () => {
          toast.success(`${ids.length} produk berhasil dihapus`)
          clearSelection()
          setDeleteTarget(null)
        },
        onError: (err) => {
          toast.error(err.message)
          setDeleteTarget(null)
        },
      })
    }
  }

  const isPending = deleteMutation.isPending
  const dialogCount = deleteTarget?.type === "bulk" ? selectedIds.size : 1

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="bg-muted/50 flex items-center gap-3 rounded-md border px-4 py-2">
          <span className="text-muted-foreground text-sm">{selectedIds.size} dipilih</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="size-4" />
            Hapus
          </Button>
        </div>
      )}

      <ProductHetTable
        data={data.data}
        searchParams={params}
        onSortChange={toggleSort}
        selection={{
          selectedIds,
          onToggleSelect: toggleSelect,
          onToggleAll: toggleAll,
        }}
        onDelete={handleSingleDelete}
      />

      <DataTablePagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        total={data.pagination.total}
        limit={params.limit}
        onPageChange={(page) => update({ page })}
        onLimitChange={(limit) => update({ limit })}
      />

      <ProductHetDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        count={dialogCount}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </div>
  )
}
