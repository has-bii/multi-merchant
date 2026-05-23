# Product Module — Implementation Plan

**Created:** 2026-05-23

## Context

Backend `product` module already exists with full CRUD at `/api/product`. Frontend has empty `src/features/product/` directory. Need to build both User (CRUD) and Admin (view-only grid) interfaces.

### Backend API Summary

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /product` | requireAuth | List products (user: own merchant only, admin: all) |
| `GET /product/available` | requireUser | Product HET items not yet claimed by user |
| `GET /product/detail/:id` | requireAuth | Single product detail |
| `POST /product` | requireUser | Create product (needs productHetId + price) |
| `PUT /product/:id` | requireUser | Update product (price only) |
| `DELETE /product/:id` | requireUser | Delete product |

Product data shape (from `productSelect`):
```
{ id, price, createdAt, updatedAt, userId, merchantId, productHetId,
  merchant: { id, name }, productHet: { id, name, price } }
```

### Route Paths

| Role | Route | Purpose |
|------|-------|---------|
| User | `/user/produk` | Product list (table) |
| User | `/user/produk/tambah` | Create product |
| User | `/user/produk/$id/edit` | Edit product |
| Admin | `/admin/produk` | Product list (card grid, view-only) |

---

## Phase 0: Foundation — API Client + Schemas

**Goal:** API client, search schema, form schema. No UI yet.

### Files to create

#### 1. `src/lib/api/product.ts`

```ts
import { createHonoClient } from "../hono-client"
import type { ProductAppType } from "backend/product"

export const productClient = createHonoClient<ProductAppType>("/api/product")
```

#### 2. `src/features/product/schemas/product.schema.ts`

Search schema for list pages. Backend query has: `page`, `limit`, `name` (optional, filters by productHet name), `productHetId` (optional), `orderBy` (createdAt|price), `order` (asc|desc).

```ts
import { z } from "zod/v4"

export const productSearchSchema = z.object({
  search: z.string().default(""),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  orderBy: z.enum(["createdAt", "price"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type ProductSearch = z.infer<typeof productSearchSchema>
```

Note: `search` maps to backend `name` param in queryFn.

#### 3. `src/features/product/schemas/product-form.schema.ts`

```ts
import { z } from "zod/v4"

// Create form — needs productHetId selector + price
export const productCreateFormSchema = z.object({
  productHetId: z.string().uuid({ message: "Produk HET tidak valid" }),
  price: z
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

// Edit form — price only
export const productEditFormSchema = z.object({
  price: z
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export type ProductCreateFormValues = z.input<typeof productCreateFormSchema>
export type ProductEditFormValues = z.input<typeof productEditFormSchema>
```

---

## Phase 1: User — Product List + Delete

**Goal:** User product list page with table, search, sort, pagination, delete (single).

### Files to create

#### 1. `src/features/product/queries/product.queries.ts`

Key factory + query options for list + detail.

```ts
import { queryOptions } from "@tanstack/react-query"
import { productClient } from "@/lib/api/product"
import type { ProductSearch } from "../schemas/product.schema"

export const productKeys = {
  all: ["product"] as const,
  list: (params: ProductSearch) => [...productKeys.all, "list", params] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
  available: () => [...productKeys.all, "available"] as const,
}

export function getProductQueryOptions(params: ProductSearch) {
  return queryOptions({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const res = await productClient.index.$get({
        query: {
          page: String(params.page),
          limit: String(params.limit),
          orderBy: params.orderBy,
          order: params.order,
          ...(params.search ? { name: params.search } : {}),
        },
      })
      if (!res.ok) throw new Error("Gagal memuat data produk")
      return res.json()
    },
  })
}

export function getProductByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await productClient["detail/:id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail produk")
      return res.json()
    },
  })
}

export function getAvailableProductsQueryOptions() {
  return queryOptions({
    queryKey: productKeys.available(),
    queryFn: async () => {
      const res = await productClient.available.$get()
      if (!res.ok) throw new Error("Gagal memuat produk tersedia")
      return res.json()
    },
  })
}
```

#### 2. `src/features/product/hooks/use-product-delete.ts`

```ts
import { productKeys } from "@/features/product/queries/product.queries"
import { productClient } from "@/lib/api/product"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await productClient[":id"].$delete({ param: { id } })
      if (!res.ok) throw new Error("Gagal menghapus produk")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}
```

#### 3. `src/features/product/components/product-delete-dialog.tsx`

Same pattern as `product-het-delete-dialog.tsx`. Single delete only (no bulk).

#### 4. `src/features/product/components/product-table.tsx`

Table columns: product name (productHet.name), HET price (productHet.price), your price (price), created, updated. Actions: edit link, delete.

Follow `product-het-table.tsx` pattern. No bulk selection (user manages own products).

#### 5. `src/features/product/components/product-list-content.tsx`

Content component: `useSuspenseQuery` → `ProductTable` + `DataTablePagination` + `ProductDeleteDialog`.

Follow `product-het-list-content.tsx` pattern.

#### 6. `src/routes/_authenticated/user/produk/index.tsx`

Route file. `validateSearch: productSearchSchema`. Page layout with `DebouncedSearch`, `QueryBoundary`, `ProductListContent`. Add button links to `/user/produk/tambah`.

Follow `produk-het/index.tsx` pattern.

---

## Phase 2: User — Product Create + Edit Forms

**Goal:** Create and edit pages with TanStack Form + Zod.

### Files to create

#### 1. `src/features/product/hooks/use-product-form.ts`

Form hook. Create mode: needs `productHetId` + `price`. Edit mode: price only.

```ts
// Key differences from product-het form:
// - Two schemas: productCreateFormSchema / productEditFormSchema
// - Create: defaultValues include productHetId (empty string)
// - Create: mutation uses productClient.index.$post
// - Edit: mutation uses productClient[":id"].$put (price only)
// - Edit: navigate back to /user/produk after success
// - On create success: invalidate productKeys.all + navigate to /user/produk
```

#### 2. `src/features/product/components/product-form.tsx`

Two variants via `mode` prop or separate components:
- **Create form**: productHet selector dropdown (from `getAvailableProductsQueryOptions`) + price input
- **Edit form**: price input only

ProductHet selector: `<Select>` showing name + max price hint.

#### 3. `src/routes/_authenticated/user/produk/tambah.tsx`

Route: no loader needed (available products fetched in form component via useSuspenseQuery or regular query).

Page layout: Card with `ProductForm` (create mode).

#### 4. `src/routes/_authenticated/user/produk/$id.edit.tsx`

Route: loader prefetches `getProductByIdQueryOptions(id)`.

Page layout: Card with `ProductForm` (edit mode, `initialData` from loader).

---

## Phase 3: Admin — Product Grid View

**Goal:** Admin product listing as e-commerce card grid. View-only, no mutations.

### Files to create

#### 1. `src/features/product/components/product-card.tsx`

Card component showing:
- Product name (productHet.name)
- Merchant name
- Your price vs HET price
- Created date

Use shadcn `Card` component. Responsive grid item.

#### 2. `src/features/product/components/admin-product-list-content.tsx`

Content component: `useSuspenseQuery` → responsive grid of `ProductCard` + `DataTablePagination`.

Grid: `grid grid-cols-1 @md/main:grid-cols-2 @xl/main:grid-cols-3 @3xl/main:grid-cols-4 gap-4`.

No delete dialog, no selection.

#### 3. `src/routes/_authenticated/admin/produk/index.tsx`

Route file. `validateSearch: productSearchSchema`. Page layout with `DebouncedSearch`, `QueryBoundary`, `AdminProductListContent`.

No add button (admin view-only).

---

## File Summary

```
src/lib/api/product.ts                                          # Phase 0
src/features/product/schemas/product.schema.ts                  # Phase 0
src/features/product/schemas/product-form.schema.ts             # Phase 0
src/features/product/queries/product.queries.ts                 # Phase 1
src/features/product/hooks/use-product-delete.ts                # Phase 1
src/features/product/components/product-delete-dialog.tsx       # Phase 1
src/features/product/components/product-table.tsx               # Phase 1
src/features/product/components/product-list-content.tsx        # Phase 1
src/routes/_authenticated/user/produk/index.tsx                 # Phase 1
src/features/product/hooks/use-product-form.ts                  # Phase 2
src/features/product/components/product-form.tsx                # Phase 2
src/routes/_authenticated/user/produk/tambah.tsx                # Phase 2
src/routes/_authenticated/user/produk/$id.edit.tsx              # Phase 2
src/features/product/components/product-card.tsx                # Phase 3
src/features/product/components/admin-product-list-content.tsx  # Phase 3
src/routes/_authenticated/admin/produk/index.tsx                # Phase 3
```

**Total: 16 files across 4 phases.**

---

## Notes

- All UI strings in Indonesian
- Follow existing `product-het` patterns exactly
- Backend types imported from `backend/product`
- Run dev server after adding routes to regenerate `routeTree.gen.ts`
- `search` param maps to backend `name` filter (searches by productHet name)
- No bulk delete for user (single product management, not bulk)
- Admin has no mutation hooks — only query options
