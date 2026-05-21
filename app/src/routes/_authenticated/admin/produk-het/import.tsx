import {
  Header,
  HeaderBack,
  HeaderBreadcrumb,
  HeaderCenter,
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
} from "@/components/header"
import { MainPage, MainPageContent } from "@/components/main-page"
import { ProductHetImportDropzone } from "@/features/product-het/components/product-het-import-dropzone"
import { ProductHetImportPreview } from "@/features/product-het/components/product-het-import-preview"
import { ProductHetImportResults } from "@/features/product-het/components/product-het-import-results"
import { productHetClient } from "@/lib/api/product-het"

import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import type { ImportExecuteResultDto, ImportPreviewResponseDto } from "backend/product-het"
import { useState } from "react"
import { toast } from "sonner"

export const Route = createFileRoute("/_authenticated/admin/produk-het/import")({
  component: RouteComponent,
})

type Step = "upload" | "preview" | "results"

const stepTitles: Record<Step, string> = {
  upload: "Import Produk HET",
  preview: "Preview Import",
  results: "Import Selesai",
}

function RouteComponent() {
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<ImportPreviewResponseDto | null>(null)
  const [executeResult, setExecuteResult] = useState<ImportExecuteResultDto | null>(null)

  const previewMutation = useMutation({
    mutationFn: async (fileVar: File): Promise<ImportPreviewResponseDto> => {
      const res = await productHetClient.import.preview.$post({
        form: { file: fileVar },
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
    <MainPage>
      <Header>
        <HeaderLeft>
          <HeaderBack className="@lg/main:hidden" linkOptions={{ to: ".." }} />
          <HeaderBreadcrumb
            className="hidden @lg/main:flex"
            items={[
              { label: "Dashboard", to: "/admin" },
              { label: "Produk HET", to: "/admin/produk-het" },
              { label: "Import" },
            ]}
          />
        </HeaderLeft>
        <HeaderCenter className="@lg/main:hidden">
          <HeaderTitle>{stepTitles[step]}</HeaderTitle>
        </HeaderCenter>
        <HeaderRight />
      </Header>

      <MainPageContent>
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
      </MainPageContent>
    </MainPage>
  )
}
