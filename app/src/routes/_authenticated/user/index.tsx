import { useAuth } from "@/auth"
import {
  Header,
  HeaderBreadcrumb,
  HeaderCenter,
  HeaderLeft,
  HeaderTitle,
} from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  return (
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBreadcrumb className="hidden @lg/main:flex" items={[{ label: "Dashboard" }]} />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderCenter>
      </Header>
      <MainPageContent>
        <div>
          <h1 className="text-2xl font-bold">Selamat Datang</h1>
          <p className="text-muted-foreground mt-2">
            Halo, {user?.name ?? "Pengguna"}! Selamat datang di akun Anda.
          </p>
        </div>
      </MainPageContent>
    </MainPage>
  )
}
