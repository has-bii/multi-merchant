import { useCallback } from "react"

interface UseListStateOptions<T extends { page: number }> {
  params: T
  onUpdate: (params: T) => void
  onReset?: () => void
}

export function useListState<T extends { page: number }>({
  params,
  onUpdate,
  onReset,
}: UseListStateOptions<T>) {
  const update = useCallback(
    (partial: Partial<T>) => {
      const next = {
        ...params,
        ...partial,
        ...(partial.page !== undefined ? {} : { page: 1 }),
      }
      onReset?.()
      onUpdate(next)
    },
    [params, onUpdate, onReset],
  )

  return { params, update }
}
