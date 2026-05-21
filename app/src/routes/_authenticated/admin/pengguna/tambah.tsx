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
import { UserForm } from "@/features/user/components/user-form"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/pengguna/tambah")({
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
              { label: "Pengguna", to: "/admin/pengguna" },
              { label: "Tambah" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Tambah Pengguna</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <Card className="mx-auto w-full max-w-xl">
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </MainPageContent>
    </MainPage>
  )
}
