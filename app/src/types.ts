import type { QueryClient } from "@tanstack/react-query"
import type { AuthState } from "./auth"

export interface RouterContext {
  auth: AuthState
  queryClient: QueryClient
}
