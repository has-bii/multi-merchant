import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: ({ context }) => {
    const role = context.auth.user?.role

    if (role === "admin") {
      throw redirect({ to: "/admin" })
    }

    throw redirect({ to: "/user" })
  },
})
