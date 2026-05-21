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
import { Card, CardContent } from "@/components/ui/card"
import { ProductHetForm } from "@/features/product-het/components/product-het-form"
import { getProductHetByIdQueryOptions } from "@/features/product-het/queries/product-het.queries"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/$id/edit")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(getProductHetByIdQueryOptions(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const product = Route.useLoaderData()

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: "/admin/produk-het" }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/admin" },
              { label: "Produk HET", to: "/admin/produk-het" },
              { label: "Edit" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Edit Produk HET</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <Card className="mx-auto w-full max-w-xl">
          <CardContent>
            <ProductHetForm initialData={product} />
          </CardContent>
        </Card>
      </MainPageContent>
    </MainPage>
  )
}
