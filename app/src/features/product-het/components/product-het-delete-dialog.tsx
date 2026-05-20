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

interface ProductHetDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  onConfirm: () => void
  isPending: boolean
}

export function ProductHetDeleteDialog({
  open,
  onOpenChange,
  count,
  onConfirm,
  isPending,
}: ProductHetDeleteDialogProps) {
  const isBulk = count > 1

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBulk ? `Hapus ${count} Produk HET` : "Hapus Produk HET"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk
              ? `${count} produk akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.`
              : "Produk akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="secondary" disabled={isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
