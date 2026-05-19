import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/user/dashboard")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="text-muted-foreground mt-2">Your personal dashboard.</p>
    </div>
  )
}
