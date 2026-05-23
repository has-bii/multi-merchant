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
import { ProductForm } from "@/features/product/components/product-form"
import { getProductByIdQueryOptions } from "@/features/product/queries/product.queries"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/produk/$id/edit")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(getProductByIdQueryOptions(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const product = Route.useLoaderData()

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack
            className="@lg/main:hidden"
            linkOptions={{ to: "/user/produk" }}
          />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/user" },
              { label: "Produk", to: "/user/produk" },
              { label: "Edit" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Edit Produk</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <Card className="mx-auto w-full max-w-xl">
          <CardContent>
            <ProductForm
              initialData={{
                id: product.id,
                productHetId: product.productHetId,
                price: Number(product.price),
              }}
            />
          </CardContent>
        </Card>
      </MainPageContent>
    </MainPage>
  )
}
