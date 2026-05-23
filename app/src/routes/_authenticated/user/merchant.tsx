import {
  Header,
  HeaderBack,
  HeaderBreadcrumb,
  HeaderCenter,
  HeaderLeft,
  HeaderTitle,
} from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { MerchantDetailForm } from "@/features/merchant/components/merchant-detail-form"
import { getMerchantByUserQueryOptions } from "@/features/merchant/queries/merchant.queries"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/merchant")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useSuspenseQuery(getMerchantByUserQueryOptions())

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: ".." }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[{ label: "Dashboard", to: ".." }, { label: "Detail Merchant" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Detail Merchant</HeaderTitle>
        </HeaderCenter>
      </Header>
      <MainPageContent>
        <div>
          <h1 className="mb-4 text-2xl font-bold">Detail Merchant</h1>
          <MerchantDetailForm merchant={data!} />
        </div>
      </MainPageContent>
    </MainPage>
  )
}
