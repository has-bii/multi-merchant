import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface StepSuccessProps {
  onFinish: () => void
}

export function StepSuccess({ onFinish }: StepSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <CheckCircle className="size-16 text-green-500" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Merchant Berhasil Dibuat!</h2>
        <p className="text-muted-foreground max-w-md">
          Merchant Anda telah dibuat. Sekarang Anda dapat mengelola produk dan melihat detail merchant.
        </p>
      </div>
      <Button onClick={onFinish}>Ke Dashboard</Button>
    </div>
  )
}
