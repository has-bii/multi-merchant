import { DataTablePagination } from "@/components/data-table-pagination"
import { Button } from "@/components/ui/button"
import { ProductHetDeleteDialog } from "@/features/product-het/components/product-het-delete-dialog"
import { ProductHetTable } from "@/features/product-het/components/product-het-table"
import {
  useBulkDeleteProductHet,
  useDeleteProductHet,
} from "@/features/product-het/hooks/use-product-het-delete"
import { getProductHetQueryOptions } from "@/features/product-het/queries/product-het.queries"
import type { ProductHetSearch } from "@/features/product-het/schemas/product-het.schema"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

interface ProductHetListContentProps {
  params: ProductHetSearch
  update: (partial: Partial<ProductHetSearch>) => void
}

export function ProductHetListContent({ params, update }: ProductHetListContentProps) {
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getProductHetQueryOptions(params))

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [deleteTarget, setDeleteTarget] = useState<{ type: "single" | "bulk"; id?: string } | null>(
    null,
  )

  const deleteMutation = useDeleteProductHet()
  const bulkDeleteMutation = useBulkDeleteProductHet()

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getProductHetQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: ProductHetSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === data.data.length) return new Set()
      return new Set(data.data.map((p) => p.id))
    })
  }, [data.data])

  const handleSingleDelete = useCallback((id: string) => {
    setDeleteTarget({ type: "single", id })
  }, [])

  const handleBulkDelete = useCallback(() => {
    setDeleteTarget({ type: "bulk" })
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return

    if (deleteTarget.type === "single" && deleteTarget.id) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Produk berhasil dihapus")
          setSelectedIds((prev) => {
            const next = new Set(prev)
            next.delete(deleteTarget.id!)
            return next
          })
          setDeleteTarget(null)
        },
        onError: (err) => {
          toast.error(err.message)
          setDeleteTarget(null)
        },
      })
    } else if (deleteTarget.type === "bulk") {
      const ids = Array.from(selectedIds)
      bulkDeleteMutation.mutate(ids, {
        onSuccess: () => {
          toast.success(`${ids.length} produk berhasil dihapus`)
          setSelectedIds(new Set())
          setDeleteTarget(null)
        },
        onError: (err) => {
          toast.error(err.message)
          setDeleteTarget(null)
        },
      })
    }
  }, [deleteTarget, selectedIds, deleteMutation, bulkDeleteMutation])

  const isPending = deleteMutation.isPending || bulkDeleteMutation.isPending
  const dialogCount = deleteTarget?.type === "bulk" ? selectedIds.size : 1

  return (
    <div className="space-y-4">
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
          <span className="text-sm text-muted-foreground">{selectedIds.size} dipilih</span>
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
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAll}
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
