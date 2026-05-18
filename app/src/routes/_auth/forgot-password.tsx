import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/forgot-password")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <ForgotPasswordForm />
}