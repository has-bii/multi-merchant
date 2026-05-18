import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: (search) => ({
    token: (search.token as string) || "",
    error: (search.error as string) || "",
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { token, error } = Route.useSearch()

  if (error) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Link Tidak Valid</h2>
        <p className="text-muted-foreground">
          Link reset password tidak valid atau sudah kadaluarsa. Silakan meminta link baru.
        </p>
        <a href="/forgot-password" className="text-primary underline">
          Minta Link Baru
        </a>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Token Tidak Ditemukan</h2>
        <p className="text-muted-foreground">
          Link reset password tidak lengkap. Silakan gunakan link dari email.
        </p>
        <a href="/forgot-password" className="text-primary underline">
          Minta Link Baru
        </a>
      </div>
    )
  }

  return <ResetPasswordForm token={token} />
}