# Plan: Merchant Feature

## Decisions Summary

| Decision | Choice |
|---|---|
| `userId` type | `uuid` with `references(user.id, { onDelete: "cascade" })` |
| User-merchant cardinality | 1:1 — `unique()` on `userId` |
| Name storage | Lowercased at application layer (service) before insert/update |
| Name filter | `ILIKE` with `startsWith` pattern, search term lowercased before query |
| DELETE endpoint | None — merchants are permanent records |
| POST duplicate guard | 409 Conflict if user already owns a merchant |
| PUT `:id` | Supports `"me"` alias for convenience; admin **not** allowed |
| Frontend scope | Admin-only pages only (user dashboard deferred) |
| Page language | Indonesian labels with "Merchant" as proper noun (e.g., "Daftar Merchant") |
| Sidebar label | "Merchant" |

---

## Phase 1: Model Creation

### 1.1 Add `merchant` table to `backend/src/db/schema.ts`

```ts
export const merchant = pgTable(
  "merchant",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    name: text("name").notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    phone: text("phone").notNull(),
    address: text("address").notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("merchant_userId_idx").on(table.userId),
    index("merchant_name_idx").on(table.name),
  ]
)

export const merchantRelations = relations(merchant, ({ one }) => ({
  user: one(user, {
    fields: [merchant.userId],
    references: [user.id],
  }),
}))
```

Add `merchants: many(merchant)` to `userRelations`.

### 1.2 Generate & run migration

```bash
pnpm db:generate
pnpm db:migrate
```

### 1.3 Seed data (optional)

Extend `backend/src/db/seed.ts` to create a demo merchant linked to a demo user if helpful for dev.

---

## Phase 2: Module Creation

Directory: `backend/src/modules/merchant/`

### 2.1 `schema.ts` — Zod schemas + DTO types

```ts
import { z } from "zod/v4"
import { querySchema } from "../../schemas/query.schema.js"

export const merchantSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  phone: z.string().min(1, "Telepon wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  description: z.string().optional(),
})

export const getMerchantQuerySchema = querySchema.extend({
  name: z.string().optional(),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export interface MerchantListItem {
  id: string
  name: string
  address: string
  createdAt: string
}

export interface MerchantListResponse {
  data: MerchantListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MerchantDetailResponse {
  id: string
  name: string
  phone: string
  address: string
  description: string | null
  createdAt: string
  updatedAt: string
  user: {
    name: string
    email: string
  }
}

export type GetMerchantQueryDto = z.infer<typeof getMerchantQuerySchema>
export type CreateMerchantDto = z.infer<typeof merchantSchema>
export type UpdateMerchantDto = z.infer<typeof merchantSchema>
```

### 2.2 `repository.ts` — DB adapter

- `list(query: GetMerchantQueryDto)` — paginated list with `ILIKE` filter on `name` (lowercased search), sort by `name` or `createdAt`. Returns columns: `id`, `name`, `address`, `createdAt`.
- `findById(id: string)` — full merchant row.
- `findByUserId(userId: string)` — full merchant row.
- `findByName(name: string)` — check existence (for uniqueness/duplicate guard).
- `create(data: CreateMerchantDto & { userId: string; name: string })` — insert, lowercase name.
- `update(id: string, data: UpdateMerchantDto & { name?: string })` — update, lowercase name if provided.

### 2.3 `service.ts` — Business logic

- `listMerchants(query)` — delegate to `repo.list()`.
- `getMerchant(id: string)` — if `id === "me"`, look up by `c.get("user")!.id`. Otherwise `repo.findById(id)`. Returns `MerchantDetailResponse` with joined `user` (name, email). Throws 404 if not found.
- `createMerchant(data, userId)` — check user's role is `"user"` (not `"admin"`). Check user does not already own a merchant (409). Lowercase `name`. Insert.
- `updateMerchant(id, data, userId)` — if `id === "me"`, resolve to user's merchant. Verify merchant belongs to `userId` (403 if not). Lowercase `name` if provided. Update.

### 2.4 `route.ts` — HTTP wiring

```ts
export const crudRoute = createApp()
  .get("/", requireAdmin, zValidator("query", getMerchantQuerySchema), async (c) => {
    return c.json(await service.listMerchants(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    const id = c.req.param("id")
    if (id !== "me" && c.get("user")!.role !== "admin") {
      throw new HTTPException(403, { message: "Akses ditolak" })
    }
    return c.json(await service.getMerchant(id, c.get("user")!.id))
  })
  .post("/", requireAuth, zValidator("json", merchantSchema), async (c) => {
    if (c.get("user")!.role !== "user") {
      throw new HTTPException(403, { message: "Hanya user yang dapat membuat merchant" })
    }
    return c.json(
      await service.createMerchant(c.req.valid("json"), c.get("user")!.id),
      201
    )
  })
  .put("/:id", requireAuth, zValidator("json", merchantSchema), async (c) => {
    if (c.get("user")!.role !== "user") {
      throw new HTTPException(403, { message: "Hanya user yang dapat mengubah merchant" })
    }
    return c.json(
      await service.updateMerchant(c.req.param("id"), c.req.valid("json"), c.get("user")!.id)
    )
  })
```

### 2.5 `index.ts` — Module export

```ts
import { createApp } from "../../lib/typed-app.js"
import { crudRoute } from "./route.js"

export const merchantRoute = createApp().route("/", crudRoute)

export type MerchantAppType = typeof merchantRoute

export type {
  MerchantListItem,
  MerchantListResponse,
  MerchantDetailResponse,
  GetMerchantQueryDto,
  CreateMerchantDto,
  UpdateMerchantDto,
} from "./schema.js"
```

### 2.6 Wire into `backend/src/app.ts`

```ts
import { merchantRoute } from "./modules/merchant/index.js"

api.route("/merchant", merchantRoute)
```

---

## Phase 3: Frontend Integration (Admin Only)

### 3.1 API Client — `app/src/lib/api/merchant.ts`

```ts
import { createHonoClient } from "../hono-client"
import type { MerchantAppType } from "backend/merchant"

export const merchantClient = createHonoClient<MerchantAppType>("/api/merchant")
```

### 3.2 Feature folder structure

```
app/src/features/merchant/
├── components/
│   ├── merchant-list-content.tsx
│   ├── merchant-table.tsx
│   └── merchant-detail-content.tsx
├── queries/
│   └── merchant.queries.ts
├── schemas/
│   └── merchant.schema.ts
└── hooks/
    └── (none needed for read-only admin view)
```

### 3.3 Schema — `app/src/features/merchant/schemas/merchant.schema.ts`

```ts
import { z } from "zod/v4"

export const merchantSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  name: z.string().optional(),
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type MerchantSearch = z.infer<typeof merchantSearchSchema>
```

### 3.4 Queries — `app/src/features/merchant/queries/merchant.queries.ts`

```ts
import { queryOptions } from "@tanstack/react-query"
import { merchantClient } from "@/lib/api/merchant"
import type { MerchantListResponse, MerchantDetailResponse } from "backend/merchant"

import type { MerchantSearch } from "../schemas/merchant.schema"

export const merchantKeys = {
  all: ["merchant"] as const,
  list: (params: MerchantSearch) => [...merchantKeys.all, "list", params] as const,
  detail: (id: string) => [...merchantKeys.all, "detail", id] as const,
}

export function getMerchantListQueryOptions(params: MerchantSearch) {
  return queryOptions({
    queryKey: merchantKeys.list(params),
    queryFn: async () => {
      const res = await merchantClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          ...(params.name ? { name: params.name } : {}),
          orderBy: params.orderBy,
          order: params.order,
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data merchant")
      return (await res.json()) as MerchantListResponse
    },
  })
}

export function getMerchantDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: merchantKeys.detail(id),
    queryFn: async () => {
      const res = await merchantClient[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail merchant")
      return (await res.json()) as MerchantDetailResponse
    },
  })
}
```

### 3.5 Components

#### `merchant-table.tsx`

- Uses `<SortableHeader>` for `name` and `createdAt` columns.
- Columns: Nama (clickable Link to detail), Alamat, Dibuat.
- No delete action.
- Uses `TableEmptyState` with message `"Tidak ada merchant ditemukan."`.

#### `merchant-list-content.tsx`

- `useSuspenseQuery` with `getMerchantListQueryOptions`.
- `useListState` for URL-synced params.
- `QueryBoundary` with `<TableSkeleton columns={3} rows={params.limit} />`.
- `DebouncedSearch` for `name` filter (placeholder: `"Cari merchant..."`).
- `DataTablePagination`.
- Prefetch next page.

#### `merchant-detail-content.tsx`

- `useSuspenseQuery` with `getMerchantDetailQueryOptions(id)`.
- Display: name, description, phone, address, createdAt (label: "Dibuat").
- Include user info (name, email) as sub-section or inline.
- Back link to list page.

### 3.6 Routes

#### List page — `app/src/routes/_authenticated/admin/merchant/index.tsx`

```tsx
export const Route = createFileRoute("/_authenticated/admin/merchant/")({
  validateSearch: merchantSearchSchema,
  component: RouteComponent,
})
```

- Uses `MainPage`, `Header`, `HeaderBreadcrumb` (Dashboard → Merchant).
- Title: "Daftar Merchant".

#### Detail page — `app/src/routes/_authenticated/admin/merchant/$id.tsx`

```tsx
export const Route = createFileRoute("/_authenticated/admin/merchant/$id")({
  component: RouteComponent,
})
```

- Title: merchant name (or "Detail Merchant").
- Renders `<MerchantDetailContent id={Route.useParams().id} />`.

### 3.7 Sidebar update — `app/src/components/app-sidebar.tsx`

Add to `items` array:

```ts
{
  title: "Merchant",
  url: "/admin/merchant",
  icon: Store, // or Building2 from lucide-react
}
```

### 3.8 Run dev server to regenerate route tree

```bash
pnpm dev
```

---

## Verification Checklist

| # | Check |
|---|---|
| 1 | `pnpm db:generate` creates migration with `merchant` table + indexes |
| 2 | `pnpm db:migrate` applies cleanly |
| 3 | POST `/api/merchant` as user → 201, merchant created with lowercase name |
| 4 | POST `/api/merchant` same user again → 409 |
| 5 | POST `/api/merchant` as admin → 403 |
| 6 | GET `/api/merchant?name=abc` returns ILIKE-filtered results (name lowercased) |
| 7 | GET `/api/merchant?orderBy=name&order=asc` sorts correctly |
| 8 | GET `/api/merchant/:uuid` as admin → full detail with user |
| 9 | GET `/api/merchant/me` as user → own merchant detail |
| 10 | PUT `/api/merchant/me` as user → updates own merchant, name lowercased |
| 11 | Admin list page renders table with sortable columns |
| 12 | Name column links to `/admin/merchant/:id` |
| 13 | Detail page shows all fields + user info |
| 14 | Sidebar shows "Merchant" link, active state works |
