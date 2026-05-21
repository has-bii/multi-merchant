import { PageSkeleton } from "@/components/page-skeleton"

import type { ReactNode } from "react"
import { createContext, useContext, useMemo } from "react"

import { authClient } from "./lib/auth-client"
import type { User } from "./lib/auth-client"

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession()

  const isAuthenticated = useMemo(() => !!session?.user, [session])

  if (isPending) return <PageSkeleton />

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: session ? session.user : null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
