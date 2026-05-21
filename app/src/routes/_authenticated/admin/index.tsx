import { Header, HeaderCenter, HeaderLeft, HeaderRight, HeaderTitle } from "@/components/header"

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <Header>
        <HeaderLeft>
          <HeaderTitle>Admin Home</HeaderTitle>
        </HeaderLeft>
        <HeaderCenter />
        <HeaderRight />
      </Header>
      <p className="text-muted-foreground px-4">Welcome to the admin area.</p>
    </div>
  )
}
