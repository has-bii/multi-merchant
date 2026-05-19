import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableEmptyStateProps {
  headers: string[]
  message?: string
}

export function TableEmptyState({
  headers,
  message = "Tidak ada data ditemukan.",
}: TableEmptyStateProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={headers.length} className="h-24 text-center">
              {message}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
