# API Clients

## Hono Client Factory

`src/lib/hono-client.ts` provides a typed client factory:

```ts
import type { Hono } from "hono"
import { hc } from "hono/client"

const API_BASE_URL = import.meta.env.VITE_API_URL

export function createHonoClient<T extends Hono<any, any, any>>(path: string) {
  return hc<T>(`${API_BASE_URL}${path}`, {
    init: { credentials: "include" },
  })
}
```

- `credentials: "include"` — sends cookies (session cookie for auth)
- `VITE_API_URL` — from `.env`, points to backend
- Generic `T` — the Hono app type from backend for full type safety

## Per-Feature API Client

Each feature creates its own client in `src/lib/api/{name}.ts`:

```ts
import { createHonoClient } from "../hono-client"
import type { ProductHetAppType } from "backend/product-het"

export const productHetClient = createHonoClient<ProductHetAppType>("/api/product-het")
```

- **One file per feature** — don't mix API clients
- **Type import from `backend/`** — `backend` is a `file:../backend` dependency in package.json
- **Path matches backend route prefix** — `/api/product-het`

## Backend Type Imports

Backend exports Hono app types for each feature module. Import them for type-safe API calls:

```ts
import type { ProductHetAppType } from "backend/product-het"
import type { ProductHetListResponse, ProductHetListItem } from "backend/product-het"
```

- `XxxAppType` — for `createHonoClient<T>`
- `XxxResponse`, `XxxItem` — for response type assertions in queries

## Using the Client

```ts
// GET with query params
const res = await productHetClient.index.$get({
  query: {
    page: String(params.page),
    limit: String(params.limit),
    orderBy: params.orderBy,
    order: params.order,
  },
})

// POST with JSON body
const res = await productHetClient.index.$post({ json: data })

// PUT with param + JSON body
const res = await productHetClient[":id"].$put({
  param: { id },
  json: data,
})

// DELETE with param
const res = await productHetClient[":id"].$delete({ param: { id } })
```

- Query params must be `string` — coerce numbers with `String()`
- Route params use `param: { id }`
- Always check `res.ok` — throw if false
- Parse response with `await res.json()` + type assertion

## Adding a New API Client

1. Backend exports `XxxAppType` from its feature module
2. Create `src/lib/api/{name}.ts`
3. Import type from `backend/{name}`
4. Call `createHonoClient<XxxAppType>("/api/{name}")`
5. Use client in `queries/` and `hooks/`
