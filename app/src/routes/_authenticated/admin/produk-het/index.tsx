import { DebouncedSearch } from "@/components/debounced-search"
import { QueryBoundary } from "@/components/query-boundary"
import { TableSkeleton } from "@/components/table-skeleton"
import { Button } from "@/components/ui/button"
import { ProductHetListContent } from "@/features/product-het/components/product-het-list-content"
import { productHetSearchSchema } from "@/features/product-het/schemas/product-het.schema"
import { useListState } from "@/hooks/use-list-state"

import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/")({
  validateSearch: productHetSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const { params, update } = useListState({
    params: searchParams,
    onUpdate: (next) => navigate({ search: next, replace: true }),
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Produk HET</h1>
        <p className="text-muted-foreground mt-2">Kelola produk HET di sini.</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <DebouncedSearch
          value={params.search}
          onChange={(search) => update({ search })}
          placeholder="Cari produk..."
        />
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/produk-het/import">Import</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/produk-het/tambah">Tambah</Link>
          </Button>
        </div>
      </div>

      <QueryBoundary loadingFallback={<TableSkeleton columns={4} rows={params.limit} />}>
        <ProductHetListContent params={params} update={update} />
      </QueryBoundary>
    </div>
  )
}
