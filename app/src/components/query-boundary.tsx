import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Suspense } from "react"
import type { ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"
import type { FallbackProps } from "react-error-boundary"

interface QueryBoundaryProps {
  children: ReactNode
  loadingFallback?: ReactNode
  errorFallback?: (props: FallbackProps) => ReactNode
}

function ErrorFallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui"

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Gagal memuat data</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{errorMessage}</span>
        <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
          <RefreshCw />
          Coba Lagi
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function QueryBoundary({
  children,
  loadingFallback,
  errorFallback: ErrorFallback,
}: QueryBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={(props) =>
            ErrorFallback ? <ErrorFallback {...props} /> : <ErrorFallbackComponent {...props} />
          }
        >
          <Suspense fallback={loadingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
