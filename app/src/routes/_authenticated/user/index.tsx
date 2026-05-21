import { useAuth } from "@/auth"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Selamat Datang</h1>
      <p className="text-muted-foreground mt-2">
        Halo, {user?.name ?? "Pengguna"}! Selamat datang di akun Anda.
      </p>
    </div>
  )
}
