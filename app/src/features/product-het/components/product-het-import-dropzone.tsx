import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Download, FileText, Loader2, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import type { ChangeEvent, DragEvent } from "react"

interface ProductHetImportDropzoneProps {
  file: File | null
  onFileChange: (file: File | null) => void
  onPreview: () => void
  isPending: boolean
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const TEMPLATE_CSV = "Minyak Goreng 2L,28000\nBeras Premium 5kg,65000\nGula Pasir 1kg,15000"

function downloadTemplateCsv() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "template-import-produk-het.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export function ProductHetImportDropzone({
  file,
  onFileChange,
  onPreview,
  isPending,
}: ProductHetImportDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Format file tidak didukung. Gunakan .csv")
      return false
    }
    if (f.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 5MB")
      return false
    }
    setError(null)
    return true
  }, [])

  const handleFileSelect = useCallback(
    (f: File | null) => {
      if (!f) {
        onFileChange(null)
        setError(null)
        return
      }
      if (validateFile(f)) {
        onFileChange(f)
      }
    },
    [onFileChange, validateFile],
  )

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null
      handleFileSelect(f)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const f = e.dataTransfer.files[0]
      handleFileSelect(f)
    },
    [handleFileSelect],
  )

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        className={cn(
          "rounded-lg border-2 p-8 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : file
              ? "border-solid"
              : "border-dashed border-muted-foreground/25",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">
          Drag & drop file CSV di sini
          <br />
          atau
        </p>
        <label>
          <input type="file" accept=".csv" className="hidden" onChange={handleInputChange} />
          <span>
            <Button type="button" variant="outline" asChild>
              <span>Pilih File</span>
            </Button>
          </span>
        </label>

        {/* File info card */}
        {file && (
          <div className="mt-6 flex items-center justify-between rounded-md border bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {file.name} ({formatFileSize(file.size)})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleFileSelect(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Guidance */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Panduan Import</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li>
            1. Format file harus <strong>.csv</strong> (maksimal 5MB, 100 baris)
          </li>
          <li>2. Kolom 1: nama produk, Kolom 2: harga (angka saja)</li>
          <li>
            3. Jika memiliki file .xlsx, konversi ke .csv:
            <ul className="ml-4 mt-1 list-disc">
              <li>Buka file → File → Save As → pilih &quot;CSV (Comma delimited)&quot; → Simpan</li>
            </ul>
          </li>
          <li>4. Produk yang sudah ada akan diperbarui harganya</li>
        </ol>
      </div>

      {/* CSV Example */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 font-medium">Contoh Format CSV</h3>
        <pre className="mb-3 rounded-md bg-muted p-4 font-mono text-sm">
          {`Minyak Goreng 2L,28000\nBeras Premium 5kg,65000\nGula Pasir 1kg,15000`}
        </pre>
        <Button variant="outline" size="sm" onClick={downloadTemplateCsv}>
          <Download className="mr-2 h-4 w-4" />
          Download Template CSV
        </Button>
      </div>

      {/* Preview button */}
      <div className="flex justify-end">
        <Button onClick={onPreview} disabled={!file || isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memuat preview...
            </>
          ) : (
            <>Preview ▶</>
          )}
        </Button>
      </div>
    </div>
  )
}
