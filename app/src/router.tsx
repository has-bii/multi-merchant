import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { Suspense, lazy } from "react"

import { queryClient } from "./lib/query-client"
import { routeTree } from "./routeTree.gen"

const ReactQueryDevtools = lazy(() =>
  import.meta.env.DEV
    ? import("@tanstack/react-query-devtools").then((m) => ({
        default: m.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
)

export const router = createTanStackRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: {
    auth: undefined!,
    queryClient,
  },
  Wrap: ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
      <Suspense>
        <ReactQueryDevtools />
      </Suspense>
    </QueryClientProvider>
  ),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
