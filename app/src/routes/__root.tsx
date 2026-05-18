import type { RouterContext } from "@/types"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import "../styles.css"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
