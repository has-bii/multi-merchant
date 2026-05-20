import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface DataTablePaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export function DataTablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: DataTablePaginationProps) {
  const hasPrevPage = page > 1
  const hasFirstPage = page > 1
  const hasNextPage = totalPages > 0 && page < totalPages
  const hasLastPage = totalPages > 0 && page < totalPages
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
      <div className="flex items-center gap-2 justify-between sm:justify-center">
        <div className="text-sm text-muted-foreground truncate text-center sm:text-left">
          Menampilkan {startItem}-{endItem} dari {total}
        </div>
        <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={String(limit)} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center sm:justify-end gap-4 flex-wrap justify-between">
        <div className="flex items-center justify-center text-sm font-medium min-w-[80px]">
          Hal {page} dari {totalPages === 0 ? 0 : totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex"
            onClick={() => onPageChange(1)}
            disabled={!hasFirstPage}
          >
            <span className="sr-only">Halaman pertama</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPrevPage}
          >
            <span className="sr-only">Halaman sebelumnya</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
          >
            <span className="sr-only">Halaman berikutnya</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasLastPage}
          >
            <span className="sr-only">Halaman terakhir</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
