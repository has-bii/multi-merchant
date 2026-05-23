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

interface ProductDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export function ProductDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ProductDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
          <AlertDialogDescription>
            Produk akan dihapus secara permanen. Tindakan ini tidak bisa dibatalkan.
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
