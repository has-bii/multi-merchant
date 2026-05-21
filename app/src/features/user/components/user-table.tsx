import { SortableHeader } from "@/components/sortable-header"
import { TableEmptyState } from "@/components/table-empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/format"

import type { UserListItem } from "backend/user"
import { Trash2 } from "lucide-react"

import type { UserSearch } from "../schemas/user.schema"

const COLUMNS = [
  { label: "Nama", field: "name" as const },
  { label: "Terdaftar", field: "createdAt" as const },
]

interface UserTableProps {
  data: UserListItem[]
  searchParams: UserSearch
  onSortChange: (orderBy: UserSearch["orderBy"]) => void
  onDelete: (id: string) => void
}

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return <Badge variant="default">Admin</Badge>
  }
  return <Badge variant="secondary">User</Badge>
}

export function UserTable({ data, searchParams, onSortChange, onDelete }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {COLUMNS.map(({ label, field }) => (
              <TableHead key={field}>
                <SortableHeader<UserSearch["orderBy"]>
                  label={label}
                  field={field}
                  currentOrderBy={searchParams.orderBy}
                  currentOrder={searchParams.order}
                  onSortChange={onSortChange}
                />
              </TableHead>
            ))}
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableEmptyState headersLength={5} message="Tidak ada pengguna ditemukan." />
          ) : (
            data.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{formatDate(u.createdAt)}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <RoleBadge role={u.role} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(u.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
