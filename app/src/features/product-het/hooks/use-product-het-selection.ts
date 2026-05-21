import { useCallback, useState } from "react"
import type { ProductHetListItem } from "backend/product-het"

export function useProductHetSelection(data: ProductHetListItem[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    const allCurrentSelected = data.every((p) => selectedIds.has(p.id))
    if (allCurrentSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        data.forEach((p) => next.delete(p.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        data.forEach((p) => next.add(p.id))
        return next
      })
    }
  }, [data, selectedIds])

  const removeSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  return { selectedIds, toggleSelect, toggleAll, resetSelection, removeSelected, clearSelection }
}
