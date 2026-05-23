import { FormSkeleton } from "@/components/form-skeleton"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/features/product/components/product-form"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/produk/tambah")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: "/user/produk" }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/user" },
              { label: "Produk", to: "/user/produk" },
              { label: "Tambah" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Tambah Produk</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <Card className="mx-auto w-full max-w-xl">
          <CardHeader>
            <CardTitle>Tambah Produk</CardTitle>
            <CardDescription>
              Setiap merchant hanya boleh membuat satu produk per HET (Harga Eceran Tertinggi)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QueryBoundary loadingFallback={<FormSkeleton inputCount={2} />}>
              <ProductForm />
            </QueryBoundary>
          </CardContent>
        </Card>
      </MainPageContent>
    </MainPage>
  )
}
