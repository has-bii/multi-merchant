import { DataTablePagination } from "@/components/data-table-pagination"
import { ProductHetTable } from "@/features/product-het/components/product-het-table"
import { getProductHetQueryOptions } from "@/features/product-het/queries/product-het.queries"
import type { ProductHetSearch } from "@/features/product-het/schemas/product-het.schema"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"

interface ProductHetListContentProps {
  params: ProductHetSearch
  update: (partial: Partial<ProductHetSearch>) => void
}

export function ProductHetListContent({ params, update }: ProductHetListContentProps) {
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getProductHetQueryOptions(params))

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getProductHetQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: ProductHetSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  return (
    <div className="space-y-4">
      <ProductHetTable data={data.data} searchParams={params} onSortChange={toggleSort} />
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
