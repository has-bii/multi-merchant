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
import { formatDate } from "@/lib/format"

import { Link } from "@tanstack/react-router"
import type { MerchantListItem } from "backend/merchant"

import type { MerchantSearch } from "../schemas/merchant.schema"

const COLUMNS = [
  { label: "Nama", field: "name", sortable: true },
  { label: "Alamat", field: "address", sortable: false },
  { label: "Dibuat", field: "createdAt", sortable: true },
] as const

interface MerchantTableProps {
  data: MerchantListItem[]
  searchParams: MerchantSearch
  onSortChange: (orderBy: MerchantSearch["orderBy"]) => void
}

export function MerchantTable({ data, searchParams, onSortChange }: MerchantTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map((column) => (
              <TableHead key={column.label}>
                {column.sortable ? (
                  <SortableHeader<MerchantSearch["orderBy"]>
                    label={column.label}
                    field={column.field as MerchantSearch["orderBy"]}
                    currentOrderBy={searchParams.orderBy}
                    currentOrder={searchParams.order}
                    onSortChange={onSortChange}
                  />
                ) : (
                  <span>{column.label}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableEmptyState headersLength={3} message="Tidak ada merchant ditemukan." />
          )}
          {data.map((merchant) => (
            <TableRow key={merchant.id}>
              <TableCell className="font-medium">
                <Link
                  to="/admin/merchant/$id"
                  params={{ id: merchant.id }}
                  className="hover:underline"
                >
                  {merchant.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{merchant.address}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(merchant.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
