import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import type { ProductHetSearch } from "../schemas/product-het.schema"

interface ProductHet {
  id: string
  name: string
  price: string
  createdAt: string
  updatedAt: string
}

interface ProductHetTableProps {
  data: ProductHet[]
  searchParams: ProductHetSearch
  onSortChange: (orderBy: ProductHetSearch["orderBy"]) => void
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return format(date, "HH:mm 'WIB', d MMM yyyy", { locale: id })
}

function SortableHeader({
  label,
  field,
  currentOrderBy,
  currentOrder,
  onSortChange,
}: {
  label: string
  field: ProductHetSearch["orderBy"]
  currentOrderBy: ProductHetSearch["orderBy"]
  currentOrder: ProductHetSearch["order"]
  onSortChange: (orderBy: ProductHetSearch["orderBy"]) => void
  className?: string
}) {
  const isActive = currentOrderBy === field

  return (
    <Button variant="ghost" size="sm" onClick={() => onSortChange(field)}>
      <span>{label}</span>
      {!isActive ? <ArrowUpDown /> : currentOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
    </Button>
  )
}

export function ProductHetTable({ data, searchParams, onSortChange }: ProductHetTableProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Diubah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Tidak ada produk ditemukan.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                label="Nama"
                field="name"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Harga"
                field="price"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Dibuat"
                field="createdAt"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Diubah"
                field="updatedAt"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
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
