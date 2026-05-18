import { LoginForm } from "@/features/auth/components/login-form"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
