# Data Fetching

## Query Options Pattern

Every feature defines query options in `queries/{name}.queries.ts`:

```ts
import { queryOptions } from "@tanstack/react-query"
import { productHetClient } from "@/lib/api/product-het"
import type { ProductHetSearch } from "../schemas/product-het.schema"

export const productHetKeys = {
  all: ["product-het"] as const,
  list: (params: ProductHetSearch) => [...productHetKeys.all, "list", params] as const,
}

export function getProductHetQueryOptions(params: ProductHetSearch) {
  return queryOptions({
    queryKey: productHetKeys.list(params),
    queryFn: async () => {
      const res = await productHetClient.index.$get({ query: { ... } })
      if (!res.ok) throw new Error("Gagal memuat data")
      return (await res.json()) as ProductHetListResponse
    },
  })
}
```

Key conventions:
- **Key factory** — `xxxKeys` object with `all` + specific keys. Ensures consistent invalidation.
- **`queryOptions()`** — enables `useSuspenseQuery` + type inference + prefetching
- **Error throw** — `if (!res.ok) throw new Error(...)` in queryFn. Error message in Indonesian.
- **Type assertion** — `as XxxResponse` from backend types

## Consuming Queries

### In route files (list pages)

Wrap data-dependent content in `<QueryBoundary>` with a loading skeleton:

```tsx
<QueryBoundary loadingFallback={<TableSkeleton columns={4} rows={params.limit} />}>
  <ProductHetListContent />
</QueryBoundary>
```

### In content components

Use `useSuspenseQuery` — data is guaranteed after suspend:

```tsx
const { data } = useSuspenseQuery(getProductHetQueryOptions(params))
```

Never use `useQuery` with manual loading states. `QueryBoundary` + `useSuspenseQuery` handles loading/error.

## Mutations

Define mutations inline in hooks (not in `queries/`):

```ts
const createMutation = useMutation({
  mutationFn: async (data: { name: string; price: number }) => {
    const res = await productHetClient.index.$post({ json: data })
    if (!res.ok) throw new Error("Gagal membuat produk HET")
    return res.json()
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: productHetKeys.all })
    navigate({ to: "/admin/produk-het" })
  },
})
```

Mutation conventions:
- **`invalidateQueries` with key factory** — `productHetKeys.all` refreshes all list/detail queries
- **`navigate` on success** — redirect to list page
- **`throw new Error()`** — let the hook's `try/catch` handle it
- **`mutateAsync`** in form `onSubmit` — await result, catch errors

## URL Search Params + List State

List pages sync pagination/sort/filter to URL search params. Pattern:

1. **Route** defines `validateSearch` with Zod schema (provides defaults)
2. **Route component** calls `useListState` to get `params` + `update()`
3. **Content component** calls `useSuspenseQuery` with `params`
4. **`update()`** calls `navigate({ search: next, replace: true })` — updates URL without history entry

```tsx
// Route component
const searchParams = Route.useSearch()
const navigate = Route.useNavigate()
const { params, update } = useListState({
  params: searchParams,
  onUpdate: (next) => navigate({ search: next, replace: true }),
})

// Content component
const { data } = useSuspenseQuery(getProductHetQueryOptions(params))
```

`useListState` auto-resets page to 1 when non-page params change (search, sort, limit).

## Prefetching

Prefetch next page in list content components:

```ts
const nextPage = params.page + 1
if (nextPage <= data.pagination.totalPages) {
  queryClient.prefetchQuery(getProductHetQueryOptions({ ...params, page: nextPage }))
}
```

## QueryClient Config

Defined in `src/lib/query-client.ts`:

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 0,
    },
  },
})
```

- `staleTime: 1min` — refetch on window focus after 1 min
- `retry: 0` — fail fast, show error boundary immediately
