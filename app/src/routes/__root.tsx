import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { RouterContext } from "@/types"

import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

import "../styles.css"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <TooltipProvider>
      <Outlet />
      <Toaster richColors theme="light" />
    </TooltipProvider>
  )
}
