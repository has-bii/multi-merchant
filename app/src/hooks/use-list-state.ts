import { useCallback } from "react"

interface UseListStateOptions<T extends { page: number }> {
  params: T
  onUpdate: (params: T) => void
}

export function useListState<T extends { page: number }>({
  params,
  onUpdate,
}: UseListStateOptions<T>) {
  const update = useCallback(
    (partial: Partial<T>) => {
      const next = {
        ...params,
        ...partial,
        ...(partial.page !== undefined ? {} : { page: 1 }),
      }
      onUpdate(next)
    },
    [params, onUpdate],
  )

  return { params, update }
}
