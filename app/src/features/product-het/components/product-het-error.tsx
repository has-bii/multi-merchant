import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ProductHetErrorProps {
  error: Error
  onRetry: () => void
}

export function ProductHetError({ error, onRetry }: ProductHetErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Gagal memuat data</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error.message}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      </AlertDescription>
    </Alert>
  )
}
