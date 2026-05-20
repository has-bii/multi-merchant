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

const HEADERS = ["Nama", "Harga", "Dibuat", "Diubah"]

interface ProductHetTableProps {
  data: ProductHetListItem[]
  searchParams: ProductHetSearch
  onSortChange: (orderBy: ProductHetSearch["orderBy"]) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onToggleAll: () => void
  onDelete: (id: string) => void
}

export function ProductHetTable(props: ProductHetTableProps) {
  const { data, searchParams, onSortChange, selectedIds, onToggleSelect, onToggleAll, onDelete } =
    props

  if (data.length === 0) {
    return <TableEmptyState headers={["", ...HEADERS, ""]} message="Tidak ada produk ditemukan." />
  }

  const allSelected = data.length > 0 && data.every((p) => selectedIds.has(p.id))

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleAll}
                aria-label="Pilih semua"
              />
            </TableHead>
            {HEADERS.map((header, idx) => (
              <TableHead key={header}>
                <SortableHeader<ProductHetSearch["orderBy"]>
                  label={header}
                  field={PRODUCT_HET_SORT_FIELDS[idx]}
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
          {data.map((product) => (
            <TableRow
              key={product.id}
              data-state={selectedIds.has(product.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.has(product.id)}
                  onCheckedChange={() => onToggleSelect(product.id)}
                  aria-label={`Pilih ${product.name}`}
                />
              </TableCell>
              <TableCell className="font-medium capitalize px-5">{product.name}</TableCell>
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

const PRODUCT_HET_SORT_FIELDS: ProductHetSearch["orderBy"][] = [
  "name",
  "price",
  "createdAt",
  "updatedAt",
]
