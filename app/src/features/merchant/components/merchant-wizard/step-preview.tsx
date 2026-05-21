import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import type { MerchantFormValues } from "../../schemas/merchant.schema"

interface StepPreviewProps {
  data: MerchantFormValues
  onConfirm: () => void
  onPrev: () => void
  isPending: boolean
}

export function StepPreview({ data, onConfirm, onPrev, isPending }: StepPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Tinjau Data</h2>
        <p className="text-muted-foreground text-sm">
          Periksa kembali data merchant sebelum disimpan.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-3">
          <div>
            <span className="text-sm text-muted-foreground">Nama</span>
            <p className="font-medium capitalize">{data.name}</p>
          </div>
          {data.description && (
            <div>
              <span className="text-sm text-muted-foreground">Deskripsi</span>
              <p className="font-medium">{data.description}</p>
            </div>
          )}
          {!data.description && (
            <div>
              <span className="text-sm text-muted-foreground">Deskripsi</span>
              <Badge variant="secondary">Tidak ada</Badge>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Nomor Telepon</span>
            <p className="font-medium">{data.phone}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Alamat</span>
            <p className="font-medium">{data.address}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isPending} className="gap-2">
          <ArrowLeft className="size-4" /> Kembali
        </Button>
        <Button onClick={onConfirm} disabled={isPending} className="gap-2">
          <Check className="size-4" /> {isPending ? "Menyimpan..." : "Simpan Merchant"}
        </Button>
      </div>
    </div>
  )
}
