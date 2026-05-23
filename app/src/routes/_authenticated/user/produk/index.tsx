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
import { ProductListContent } from "@/features/product/components/product-list-content"
import { productSearchSchema } from "@/features/product/schemas/product.schema"
import { useListState } from "@/hooks/use-list-state"

import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/user/produk/")({
  validateSearch: productSearchSchema,
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
            items={[{ label: "Dashboard", to: "/user" }, { label: "Produk" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Produk</HeaderTitle>
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
          <Button asChild>
            <Link to="/user/produk/tambah">
              <Plus className="size-4" />
              Tambah
            </Link>
          </Button>
        </div>

        <QueryBoundary loadingFallback={<TableSkeleton columns={6} rows={params.limit} />}>
          <ProductListContent />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
