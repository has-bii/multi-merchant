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
import { MerchantListContent } from "@/features/merchant/components/merchant-list-content"
import { merchantSearchSchema } from "@/features/merchant/schemas/merchant.schema"
import { useListState } from "@/hooks/use-list-state"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/merchant/")({
  validateSearch: merchantSearchSchema,
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
            items={[{ label: "Dashboard", to: "/admin" }, { label: "Merchant" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Merchant</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <div className="flex items-center gap-4">
          <DebouncedSearch
            value={params.name}
            onChange={(name) => update({ name })}
            placeholder="Cari merchant..."
          />
        </div>

        <QueryBoundary loadingFallback={<TableSkeleton columns={3} rows={params.limit} />}>
          <MerchantListContent />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
