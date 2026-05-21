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
import { Button } from "@/components/ui/button"
import { UserListContent } from "@/features/user/components/user-list-content"
import { userSearchSchema } from "@/features/user/schemas/user.schema"
import { useListState } from "@/hooks/use-list-state"

import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/pengguna/")({
  validateSearch: userSearchSchema,
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
            items={[{ label: "Dashboard", to: "/admin" }, { label: "Pengguna" }]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>Pengguna</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
        <div className="flex items-center justify-between gap-4">
          <DebouncedSearch
            value={params.search}
            onChange={(search) => update({ search })}
            placeholder="Cari pengguna..."
          />
          <Button asChild>
            <Link to="/admin/pengguna/tambah">Tambah</Link>
          </Button>
        </div>

        <QueryBoundary loadingFallback={<TableSkeleton columns={5} rows={params.limit} />}>
          <UserListContent />
        </QueryBoundary>
      </MainPageContent>
    </MainPage>
  )
}
