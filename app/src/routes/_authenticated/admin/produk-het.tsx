import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Produk HET</h1>
      <p className="text-muted-foreground mt-2">Kelola produk HET di sini.</p>
    </div>
  )
}
