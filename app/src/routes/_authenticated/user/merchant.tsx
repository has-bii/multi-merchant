import { getMerchantByUserQueryOptions } from "@/features/merchant/queries/merchant.queries"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/merchant")({
  loader: ({ context }) => context.queryClient.ensureQueryData(getMerchantByUserQueryOptions()),
  pendingComponent: () => (
    <div className="flex min-h-32 items-center justify-center">
      <p className="text-muted-foreground">Memuat detail merchant...</p>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-destructive font-semibold">Gagal memuat detail merchant</p>
          <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm"
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
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Anda belum memiliki merchant.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detail Merchant</h1>
      <p className="text-muted-foreground mt-2">Form detail merchant akan tersedia di Phase 3.</p>
    </div>
  )
}
