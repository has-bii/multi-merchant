import { SortableHeader } from "@/components/sortable-header"
import { TableEmptyState } from "@/components/table-empty-state"
import { Button } from "@/components/ui/button"
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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import type { ProductListItem } from "../queries/product.queries"
import type { ProductSearch } from "../schemas/product.schema"

interface ProductTableProps {
  data: ProductListItem[]
  searchParams: ProductSearch
  onSortChange: (orderBy: ProductSearch["orderBy"]) => void
  onDelete: (id: string) => void
}

export function ProductTable(props: ProductTableProps) {
  const { data, searchParams, onSortChange, onDelete } = props

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Harga HET</TableHead>
            <TableHead>
              <SortableHeader<ProductSearch["orderBy"]>
                label="Harga Anda"
                field="price"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
            <TableHead>
              <SortableHeader<ProductSearch["orderBy"]>
                label="Dibuat"
                field="createdAt"
                currentOrderBy={searchParams.orderBy}
                currentOrder={searchParams.order}
                onSortChange={onSortChange}
              />
            </TableHead>
            <TableHead>Diubah</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableEmptyState headersLength={6} message="Tidak ada produk ditemukan." />
          )}
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium capitalize">{product.productHet.name}</TableCell>
              <TableCell>{formatPrice(product.productHet.price)}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(product.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(product.updatedAt)}
              </TableCell>
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
                      <Link to="/user/produk/$id/edit" params={{ id: product.id }}>
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
