import { DebouncedSearch } from "@/components/debounced-search"
import {
  Header,
  HeaderBack,
  HeaderBreadcrumb,
  HeaderCenter,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
} from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
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
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack
            className="@lg/main:hidden"
            linkOptions={{
              to: "..",
            }}
          />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[{ label: "Dashboard", to: "/admin" }, { label: "Produk HET" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Produk HET</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <div className="flex items-center justify-between gap-4">
          <DebouncedSearch
            value={params.search}
            onChange={(search) => update({ search })}
            placeholder="Cari produk..."
          />
          <div className="inline-flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/produk-het/import">Import</Link>
            </Button>
            <Button asChild>
              <Link to="/admin/produk-het/tambah">Tambah</Link>
            </Button>
          </div>
        </div>

        <QueryBoundary loadingFallback={<TableSkeleton columns={4} rows={params.limit} />}>
          <ProductHetListContent />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
