import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState } from "react"
import type { MerchantFormValues } from "../../schemas/merchant.schema"

interface StepDetailsProps {
  data: Partial<MerchantFormValues>
  onUpdate: (data: Partial<MerchantFormValues>) => void
  onNext: () => void
  onPrev: () => void
}

const PHONE_REGEX = /^08\d{8,12}$/

export function StepDetails({ data, onUpdate, onNext, onPrev }: StepDetailsProps) {
  const [phoneError, setPhoneError] = useState<string | null>(null)

  const handleNext = () => {
    if (!data.phone || data.phone.trim() === "") {
      setPhoneError("Telepon wajib diisi")
      return
    }
    if (!PHONE_REGEX.test(data.phone.trim())) {
      setPhoneError("Nomor telepon harus diawali 08 dan panjang 10-14 karakter")
      return
    }
    setPhoneError(null)
    onNext()
  }

  const isNextDisabled = !data.address || data.address.trim() === "" || !data.phone || data.phone.trim() === ""

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Detail Kontak</h2>
        <p className="text-muted-foreground text-sm">Isi nomor telepon dan alamat merchant.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon *</Label>
          <Input
            id="phone"
            placeholder="08xxxxxxxxxx"
            value={data.phone ?? ""}
            onChange={(e) => {
              onUpdate({ phone: e.target.value })
              if (phoneError) setPhoneError(null)
            }}
          />
          {phoneError && <p className="text-destructive text-sm">{phoneError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Alamat *</Label>
          <Input
            id="address"
            placeholder="Masukkan alamat merchant"
            value={data.address ?? ""}
            onChange={(e) => onUpdate({ address: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ArrowLeft className="size-4" /> Kembali
        </Button>
        <Button onClick={handleNext} disabled={isNextDisabled} className="gap-2">
          Lanjut <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
