import { Suspense, useCallback } from "react"

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"

import { DataTablePagination } from "@/features/product-het/components/data-table-pagination"
import { ProductHetError } from "@/features/product-het/components/product-het-error"
import { ProductHetSearchInput } from "@/features/product-het/components/product-het-search"
import { ProductHetTableSkeleton } from "@/features/product-het/components/product-het-skeleton"
import { ProductHetTable } from "@/features/product-het/components/product-het-table"
import {
  getProductHetQueryOptions,
} from "@/features/product-het/queries/product-het.queries"
import { productHetSearchSchema } from "@/features/product-het/schemas/product-het.schema"

export const Route = createFileRoute("/_authenticated/admin/produk-het")({
  validateSearch: productHetSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const updateSearch = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      navigate({
        search: (prev) => ({
          ...prev,
          ...updates,
          ...(updates.page !== undefined ? {} : { page: 1 }),
        }),
        replace: true,
      })
    },
    [navigate],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Produk HET</h1>
        <p className="text-muted-foreground mt-2">
          Kelola produk HET di sini.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <ProductHetSearchInput
          value={searchParams.search}
          onChange={(search) => updateSearch({ search })}
        />
        <Button>Tambah</Button>
      </div>

      <Suspense fallback={<ProductHetTableSkeleton />}>
        <ProductHetTableContent searchParams={searchParams} updateSearch={updateSearch} />
      </Suspense>
    </div>
  )
}

function ProductHetTableContent({
  searchParams,
  updateSearch,
}: {
  searchParams: ReturnType<typeof Route.useSearch>
  updateSearch: (updates: Record<string, string | number | undefined>) => void
}) {
  const queryClient = useQueryClient()

  const { data, error, refetch } = useSuspenseQuery(
    getProductHetQueryOptions(searchParams),
  )

  if (error) {
    return <ProductHetError error={error} onRetry={refetch} />
  }

  const handleSortChange = (orderBy: "name" | "price" | "createdAt" | "updatedAt") => {
    const newOrder =
      searchParams.orderBy === orderBy && searchParams.order === "asc" ? "desc" : "asc"
    updateSearch({ orderBy, order: newOrder })
  }

  // Prefetch next page
  const nextPage = searchParams.page + 1
  if (nextPage <= data.pagination.totalPages) {
    queryClient.prefetchQuery(
      getProductHetQueryOptions({ ...searchParams, page: nextPage }),
    )
  }

  return (
    <div className="space-y-4">
      <ProductHetTable
        data={data.data}
        searchParams={searchParams}
        onSortChange={handleSortChange}
      />
      <DataTablePagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        total={data.pagination.total}
        limit={searchParams.limit}
        onPageChange={(page) => updateSearch({ page })}
        onLimitChange={(limit) => updateSearch({ limit })}
      />
    </div>
  )
}
