import { DataTablePagination } from "@/components/data-table-pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductQueryOptions } from "@/features/product/queries/product.queries"
import { useListState } from "@/hooks/use-list-state"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ProductCard } from "./product-card"

export function AdminProductListContent() {
  const searchParams = useSearch({ from: "/_authenticated/admin/produk/" })
  const navigate = useNavigate({ from: "/admin/produk/" })

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
  })

  const { data } = useSuspenseQuery(getProductQueryOptions(params))

  if (data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Belum ada produk terdaftar.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 @md/main:grid-cols-2 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 gap-4">
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <DataTablePagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        total={data.pagination.total}
        limit={params.limit}
        onPageChange={(page) => update({ page })}
        onLimitChange={(limit) => update({ limit })}
      />
    </div>
  )
}

export function AdminProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 @md/main:grid-cols-2 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  )
}
