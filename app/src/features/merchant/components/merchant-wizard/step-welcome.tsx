import { Button } from "@/components/ui/button"

import { Building2, ChevronRight } from "lucide-react"

interface StepWelcomeProps {
  onNext: () => void
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="bg-primary/10 text-primary inline-flex size-16 items-center justify-center rounded-2xl">
        <Building2 className="size-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Buat Merchant</h2>
        <p className="text-muted-foreground max-w-md">
          Anda belum memiliki merchant. Ikuti langkah-langkah berikut untuk membuat merchant baru
          dan mulai mengelola produk Anda.
        </p>
      </div>
      <Button onClick={onNext}>
        Mulai <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}
