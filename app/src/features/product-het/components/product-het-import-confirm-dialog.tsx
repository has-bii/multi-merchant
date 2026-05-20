import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Loader2 } from "lucide-react"

interface ProductHetImportConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
  summary: {
    willCreate: number
    willUpdate: number
  }
}

export function ProductHetImportConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  summary,
}: ProductHetImportConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Import</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan melakukan import dengan detail:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Membuat {summary.willCreate} produk baru</li>
              <li>Memperbarui {summary.willUpdate} produk yang sudah ada</li>
            </ul>
            <p className="mt-3 font-medium text-destructive">Tindakan ini tidak bisa dibatalkan.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengimport...
              </>
            ) : (
              "Import"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
