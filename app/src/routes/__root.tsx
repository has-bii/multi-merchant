import type { RouterContext } from "@/types"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TooltipProvider } from "@/components/ui/tooltip"

import "../styles.css"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  )
}
