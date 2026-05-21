import { Button } from "@/components/ui/button"

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

interface SortableHeaderProps<TField extends string = string> {
  label: string
  field: TField
  currentOrderBy: TField
  currentOrder: "asc" | "desc"
  onSortChange: (field: TField) => void
}

export function SortableHeader<TField extends string>({
  label,
  field,
  currentOrderBy,
  currentOrder,
  onSortChange,
}: SortableHeaderProps<TField>) {
  const isActive = currentOrderBy === field

  return (
    <Button role="button" variant="ghost" size="sm" onClick={() => onSortChange(field)}>
      <span>{label}</span>
      {!isActive ? <ArrowUpDown /> : currentOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
    </Button>
  )
}
