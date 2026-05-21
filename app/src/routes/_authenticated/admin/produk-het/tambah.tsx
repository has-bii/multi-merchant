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

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/tambah")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: ".." }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/admin" },
              { label: "Produk HET", to: "/admin/produk-het" },
              { label: "Tambah" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Tambah Produk HET</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <Card className="mx-auto w-full max-w-xl">
          <CardContent>
            <ProductHetForm />
          </CardContent>
        </Card>
      </MainPageContent>
    </MainPage>
  )
}
