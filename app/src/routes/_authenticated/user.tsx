import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/user-sidebar"
import { getMerchantByUserQueryOptions } from "@/features/merchant/queries/merchant.queries"

import { useSuspenseQuery } from "@tanstack/react-query"
import { ErrorComponent, Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user")({
  beforeLoad: ({ context, location }) => {
    const role = context.auth.user?.role
    if (role === "admin") {
      throw redirect({
        to: "/admin",
        search: { redirect: location.href },
      })
    }
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(getMerchantByUserQueryOptions()),
  pendingComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Memuat...</p>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold">Gagal memuat data</p>
          <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
          <button
            onClick={() => reset()}
            className="bg-primary text-primary-foreground mt-4 rounded-md px-4 py-2 text-sm"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: merchant } = useSuspenseQuery(getMerchantByUserQueryOptions())

  if (!merchant) {
    // Placeholder — Wizard creation di Phase 2
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Buat merchant terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
