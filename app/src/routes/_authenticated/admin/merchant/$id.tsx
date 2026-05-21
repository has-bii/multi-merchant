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
import { MerchantDetailContent } from "@/features/merchant/components/merchant-detail-content"
import { getMerchantDetailQueryOptions } from "@/features/merchant/queries/merchant.queries"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/merchant/$id")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(getMerchantDetailQueryOptions(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: "/admin/merchant" }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/admin" },
              { label: "Merchant", to: "/admin/merchant" },
              { label: "Detail" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Detail Merchant</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <QueryBoundary>
          <MerchantDetailContent id={id} />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
