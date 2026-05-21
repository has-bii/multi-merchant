import { DataTablePagination } from "@/components/data-table-pagination"
import { MerchantTable } from "@/features/merchant/components/merchant-table"
import { getMerchantListQueryOptions } from "@/features/merchant/queries/merchant.queries"
import type { MerchantSearch } from "@/features/merchant/schemas/merchant.schema"
import { useListState } from "@/hooks/use-list-state"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useNavigate, useSearch } from "@tanstack/react-router"

export function MerchantListContent() {
  const searchParams = useSearch({ from: "/_authenticated/admin/merchant/" })
  const navigate = useNavigate({ from: "/admin/merchant/" })

  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery(getMerchantListQueryOptions(searchParams))

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
  })

  // Prefetch next page
  const nextPage = params.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(getMerchantListQueryOptions({ ...params, page: nextPage }))
  }

  const toggleSort = (orderBy: MerchantSearch["orderBy"]) => {
    const newOrder = params.orderBy === orderBy && params.order === "asc" ? "desc" : "asc"
    update({ orderBy, order: newOrder })
  }

  return (
    <div className="space-y-4">
      <MerchantTable data={data.data} searchParams={params} onSortChange={toggleSort} />

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
