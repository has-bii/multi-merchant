import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { MerchantFormValues } from "../../schemas/merchant.schema"

interface StepBasicInfoProps {
  data: Partial<MerchantFormValues>
  onUpdate: (data: Partial<MerchantFormValues>) => void
  onNext: () => void
  onPrev: () => void
}

export function StepBasicInfo({ data, onUpdate, onNext, onPrev }: StepBasicInfoProps) {
  const nameError = data.name !== undefined && data.name.trim() === "" ? "Nama wajib diisi" : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Informasi Dasar</h2>
        <p className="text-muted-foreground text-sm">Isi nama dan deskripsi merchant Anda.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Merchant *</Label>
          <Input
            id="name"
            placeholder="Masukkan nama merchant"
            value={data.name ?? ""}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          {nameError && <p className="text-destructive text-sm">{nameError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            placeholder="Deskripsi singkat merchant (opsional)"
            value={data.description ?? ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft className="size-4" /> Kembali
        </Button>
        <Button
          onClick={onNext}
          disabled={!data.name || data.name.trim() === ""}
          className="gap-2"
        >
          Lanjut <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
