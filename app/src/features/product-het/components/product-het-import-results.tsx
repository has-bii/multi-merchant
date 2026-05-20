import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { Link } from "@tanstack/react-router"
import type { ImportExecuteResultDto } from "backend/product-het"
import { ChevronDown } from "lucide-react"

interface ProductHetImportResultsProps {
  results: ImportExecuteResultDto
  onReset: () => void
}

export function ProductHetImportResults({ results, onReset }: ProductHetImportResultsProps) {
  const hasErrors = results.errors.length > 0

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">Import Selesai</h2>

        {/* Created */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>{results.created.length} produk berhasil dibuat</span>
        </div>

        {/* Updated */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-yellow-600">⚠</span>
          <span>{results.updated.length} produk berhasil diperbarui</span>
        </div>

        {/* Errors */}
        {hasErrors && (
          <Collapsible defaultOpen>
            <div className="flex items-center gap-2">
              <span className="text-red-600">✕</span>
              <span>{results.errors.length} produk gagal</span>
              <CollapsibleTrigger className="ml-auto">
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Toggle errors</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <ul className="mt-3 space-y-2 rounded-md bg-muted p-4">
                {results.errors.map((err: { row: number; name?: string; reason: string }) => (
                  <li key={err.row} className="text-sm">
                    Row {err.row}: &quot;{err.name ?? "Baris"}&quot; — {err.reason}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onReset}>
          Import Ulang
        </Button>
        <Button asChild>
          <Link to="/admin/produk-het">Kembali ke Produk HET</Link>
        </Button>
      </div>
    </div>
  )
}
