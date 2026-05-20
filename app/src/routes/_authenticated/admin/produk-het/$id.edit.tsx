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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Produk HET</h1>
        <p className="text-muted-foreground mt-2">Perbarui informasi produk.</p>
      </div>
      <ProductHetForm initialData={product} />
    </div>
  )
}
