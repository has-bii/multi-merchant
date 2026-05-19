import { SortableHeader } from "@/components/sortable-header"
import { TableEmptyState } from "@/components/table-empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatPrice } from "@/lib/format"

import type { ProductHetListItem } from "backend/product-het"

import type { ProductHetSearch } from "../schemas/product-het.schema"

const HEADERS = ["Nama", "Harga", "Dibuat", "Diubah"]

interface ProductHetTableProps {
  data: ProductHetListItem[]
  searchParams: ProductHetSearch
  onSortChange: (orderBy: ProductHetSearch["orderBy"]) => void
}

export function ProductHetTable({ data, searchParams, onSortChange }: ProductHetTableProps) {
  if (data.length === 0) {
    return <TableEmptyState headers={HEADERS} message="Tidak ada produk ditemukan." />
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium capitalize px-5">{product.name}</TableCell>
              <TableCell className="px-5">{formatPrice(product.price)}</TableCell>
              <TableCell className="px-5">{formatDate(product.createdAt)}</TableCell>
              <TableCell className="px-5">{formatDate(product.updatedAt)}</TableCell>
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
