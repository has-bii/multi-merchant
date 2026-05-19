import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

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
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
