import { Button } from "@/components/ui/button"
import { ProductHetImportDropzone } from "@/features/product-het/components/product-het-import-dropzone"
import { ProductHetImportPreview } from "@/features/product-het/components/product-het-import-preview"
import { ProductHetImportResults } from "@/features/product-het/components/product-het-import-results"
import { productHetClient } from "@/lib/api/product-het"

import { useMutation } from "@tanstack/react-query"
import { Link, createFileRoute } from "@tanstack/react-router"
import type { ImportExecuteResultDto, ImportPreviewResponseDto } from "backend/product-het"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_authenticated/admin/produk-het/import")({
  component: RouteComponent,
})

type Step = "upload" | "preview" | "results"

function RouteComponent() {
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<ImportPreviewResponseDto | null>(null)
  const [executeResult, setExecuteResult] = useState<ImportExecuteResultDto | null>(null)

  const previewMutation = useMutation({
    mutationFn: async (file: File): Promise<ImportPreviewResponseDto> => {
      const res = await productHetClient.import.preview.$post({
        form: { file },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        if (res.status === 413) throw new Error("Ukuran file maksimal 5MB")
        if (body && typeof body === "object" && "message" in body) {
          throw new Error(String((body as { message?: string }).message))
        }
        throw new Error("Gagal memuat preview")
      }
      return await res.json()
    },
    onSuccess: (data) => {
      setPreviewData(data)
      setStep("preview")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleReset = () => {
    setFile(null)
    setPreviewData(null)
    setExecuteResult(null)
    setStep("upload")
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/produk-het">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {step === "upload" && "Import Produk HET"}
            {step === "preview" && "Preview Import"}
            {step === "results" && "Import Selesai"}
          </h1>
          <p className="text-muted-foreground">
            {step === "upload" && "Upload file CSV untuk import produk secara massal."}
            {step === "preview" && "Review data sebelum import. Edit harga jika diperlukan."}
          </p>
        </div>
      </div>

      {/* Step content */}
      {step === "upload" && (
        <ProductHetImportDropzone
          file={file}
          onFileChange={setFile}
          onPreview={() => file && previewMutation.mutate(file)}
          isPending={previewMutation.isPending}
        />
      )}

      {step === "preview" && previewData && !executeResult && (
        <ProductHetImportPreview
          data={previewData}
          onSuccess={(data) => {
            setExecuteResult(data)
            setStep("results")
          }}
          onReset={handleReset}
        />
      )}

      {step === "results" && executeResult && (
        <ProductHetImportResults results={executeResult} onReset={handleReset} />
      )}
    </div>
  )
}
