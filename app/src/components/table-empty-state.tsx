import { TableCell, TableRow } from "@/components/ui/table"

interface TableEmptyStateProps {
  headersLength: number
  message?: string
}

export function TableEmptyState({
  headersLength,
  message = "Tidak ada data ditemukan.",
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={headersLength} className="h-24 text-center">
        {message}
      </TableCell>
    </TableRow>
  )
}
