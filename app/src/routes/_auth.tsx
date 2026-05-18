import { Outlet, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
