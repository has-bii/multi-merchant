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
import { AdminProductListContent, AdminProductListSkeleton } from "@/features/product/components/admin-product-list-content"
import { productSearchSchema } from "@/features/product/schemas/product.schema"
import { useListState } from "@/hooks/use-list-state"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk/")({
  validateSearch: productSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const searchParams = Route.useSearch()
  const navigate = Route.useNavigate()

  const { params } = useListState({
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
            items={[{ label: "Dashboard", to: "/admin" }, { label: "Produk" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Produk</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <DebouncedSearch
          value={params.search}
          onChange={(search) => navigate({ search: { ...searchParams, search }, replace: true })}
          placeholder="Cari produk..."
        />

        <QueryBoundary loadingFallback={<AdminProductListSkeleton />}>
          <AdminProductListContent />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
