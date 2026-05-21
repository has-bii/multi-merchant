import { SortableHeader } from "@/components/sortable-header"
import { TableEmptyState } from "@/components/table-empty-state"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/format"

import { Link } from "@tanstack/react-router"
import type { ProductHetListItem } from "backend/product-het"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import type { ProductHetSearch } from "../schemas/product-het.schema"

const COLUMNS = [
  { label: "Nama", field: "name" as const },
  { label: "Harga", field: "price" as const },
  { label: "Dibuat", field: "createdAt" as const },
  { label: "Diubah", field: "updatedAt" as const },
]

interface ProductHetTableProps {
  data: ProductHetListItem[]
  searchParams: ProductHetSearch
  onSortChange: (orderBy: ProductHetSearch["orderBy"]) => void
  selection?: {
    selectedIds: Set<string>
    onToggleSelect: (id: string) => void
    onToggleAll: () => void
  }
  onDelete: (id: string) => void
}

export function ProductHetTable(props: ProductHetTableProps) {
  const { data, searchParams, onSortChange, selection, onDelete } = props

  const allSelected = selection
    ? data.length > 0 && data.every((p) => selection.selectedIds.has(p.id))
    : false

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {selection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={selection.onToggleAll}
                  aria-label="Pilih semua"
                />
              </TableHead>
            )}
            {COLUMNS.map(({ label, field }) => (
              <TableHead key={field}>
                <SortableHeader<ProductHetSearch["orderBy"]>
                  label={label}
                  field={field}
                  currentOrderBy={searchParams.orderBy}
                  currentOrder={searchParams.order}
                  onSortChange={onSortChange}
                />
              </TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableEmptyState headersLength={6} message="Tidak ada produk ditemukan." />
          )}
          {data.map((product) => (
            <TableRow
              key={product.id}
              data-state={selection?.selectedIds.has(product.id) ? "selected" : undefined}
            >
              {selection && (
                <TableCell>
                  <Checkbox
                    checked={selection.selectedIds.has(product.id)}
                    onCheckedChange={() => selection.onToggleSelect(product.id)}
                    aria-label={`Pilih ${product.name}`}
                  />
                </TableCell>
              )}
              <TableCell className="px-5 font-medium capitalize">{product.name}</TableCell>
              <TableCell className="px-5">{formatPrice(product.price)}</TableCell>
              <TableCell className="px-5">{formatDate(product.createdAt)}</TableCell>
              <TableCell className="px-5">{formatDate(product.updatedAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Aksi</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/admin/produk-het/$id/edit" params={{ id: product.id }}>
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(product.id)}>
                      <Trash2 className="size-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
