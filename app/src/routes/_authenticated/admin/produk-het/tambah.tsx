import { Card, CardContent } from "@/components/ui/card"
import { ProductHetForm } from "@/features/product-het/components/product-het-form"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/tambah")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Produk HET</h1>
        <p className="text-muted-foreground mt-2">Isi form untuk menambahkan produk baru.</p>
      </div>
      <div className="max-w-xl">
        <Card>
          <CardContent>
            <ProductHetForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
