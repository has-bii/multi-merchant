# Plan: Product HET Create/Edit Form

**Date:** 2026-05-20
**Status:** Ready to implement

---

## Decisions Made

| Decision | Choice |
|----------|--------|
| Form presentation | Page routes |
| Validation timing | `onChange` (real-time) |
| Hook architecture | Single `useProductHetForm` with optional `initialData` |
| Edit data loading | TanStack Router loader + `queryClient.ensureQueryData()` |
| Router context | Add `queryClient` to router context |
| Success behavior | Navigate back to list, invalidate list query |
| Error handling | Alert pattern (same as login form) |
| UI components | Shadcn `Field`, `FieldLabel`, `FieldError`, `FieldGroup`, `Input`, `Button` |
| Language | Indonesian (UI strings) |

---

## File Changes Overview

### New files (4)
1. `app/src/features/product-het/schemas/product-het-form.schema.ts`
2. `app/src/features/product-het/hooks/use-product-het-form.ts`
3. `app/src/features/product-het/components/product-het-form.tsx`
4. `app/src/routes/_authenticated/admin/produk-het.tambah.tsx`
5. `app/src/routes/_authenticated/admin/produk-het_.$id.edit.tsx`

### Modified files (4)
1. `app/src/types.ts` — add `queryClient` to `RouterContext`
2. `app/src/router.tsx` — pass `queryClient` in context
3. `app/src/features/product-het/queries/product-het.queries.ts` — add detail query options
4. `app/src/routes/_authenticated/admin/produk-het.tsx` — wire "Tambah" button

---

## Step-by-Step Implementation

### Step 1: Add `queryClient` to Router Context

**Why:** Loaders need `queryClient` to call `ensureQueryData()`. TanStack Router passes context to loaders automatically.

**`app/src/types.ts`** — Add `queryClient` import and field:

```ts
import type { QueryClient } from "@tanstack/react-query"
import type { AuthState } from "./auth"

export interface RouterContext {
  auth: AuthState
  queryClient: QueryClient
}
```

**`app/src/router.tsx`** — Add `queryClient` to context:

```ts
context: {
  auth: undefined!,
  queryClient,  // ← add this
},
```

---

### Step 2: Add Product HET Detail Query Options

**`app/src/features/product-het/queries/product-het.queries.ts`** — Add:

```ts
export function getProductHetByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: [...productHetKeys.all, "detail", id],
    queryFn: async () => {
      const res = await productHetClient[":id"].$get({ param: { id } })
      if (!res.ok) throw new Error("Gagal memuat detail produk HET")
      return (await res.json()) as ProductHetListItem
    },
  })
}
```

Import `ProductHetListItem` from `backend/product-het`.

---

### Step 3: Create Form Schema

**`app/src/features/product-het/schemas/product-het-form.schema.ts`**

Mirrors backend `productHetSchema` exactly (same transforms, same validation):

```ts
import { z } from "zod/v4"

export const productHetFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama produk wajib diisi" })
    .transform((v) => v.trim().toLowerCase()),
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export type ProductHetFormValues = z.input<typeof productHetFormSchema>
export type ProductHetFormOutput = z.output<typeof productHetFormSchema>
```

- `z.input` = what form sees (name: string, price: string from input)
- `z.output` = after parse (name: string trimmed/lowercased, price: number)

---

### Step 4: Create Form Hook

**`app/src/features/product-het/hooks/use-product-het-form.ts`**

Single hook for create + edit. DRY — same schema, same fields, same submit flow.

```ts
import { productHetClient } from "@/lib/api/product-het"
import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { productHetFormSchema } from "../schemas/product-het-form.schema"

interface UseProductHetFormOptions {
  initialData?: {
    id: string
    name: string
    price: number
  }
}

export function useProductHetForm({ initialData }: UseProductHetFormOptions = {}) {
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isEdit = !!initialData

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

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; price: number }) => {
      const res = await productHetClient[":id"].$put({
        param: { id: initialData!.id },
        json: data,
      })
      if (!res.ok) throw new Error("Gagal memperbarui produk HET")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
      navigate({ to: "/admin/produk-het" })
    },
  })

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData?.price != null ? String(initialData.price) : "",
    },
    validators: {
      onChange: productHetFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        setError("")
        const parsed = productHetFormSchema.parse(value)

        if (isEdit) {
          await updateMutation.mutateAsync(parsed)
        } else {
          await createMutation.mutateAsync(parsed)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error, isEdit }
}
```

**Key points:**
- `defaultValues.price` is `String(initialData.price)` — input is text, Zod `z.coerce.number()` handles conversion
- `validators: { onChange: productHetFormSchema }` — real-time validation
- `productHetFormSchema.parse(value)` in onSubmit — produces transformed output for API
- Mutations invalidate `productHetKeys.all` → list auto-refreshes
- Navigate back on success

---

### Step 5: Create Form Component

**`app/src/features/product-het/components/product-het-form.tsx`**

Reusable for create + edit. Follows auth form pattern.

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useProductHetForm } from "../hooks/use-product-het-form"

interface ProductHetFormProps {
  initialData?: {
    id: string
    name: string
    price: number
  }
}

export function ProductHetForm({ initialData }: ProductHetFormProps) {
  const { form, error, isEdit } = useProductHetForm({ initialData })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form.Field
          name="name"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nama Produk</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="Nama produk HET"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="price"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Harga</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="0"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Subscribe
          selector={({ canSubmit, isDirty, isSubmitting }) => [
            canSubmit,
            isDirty,
            isSubmitting,
          ]}
          children={([canSubmit, isDirty, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || !isDirty || isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Perbarui"
                  : "Simpan"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
```

---

### Step 6: Create Route — `/admin/produk-het/tambah`

**`app/src/routes/_authenticated/admin/produk-het.tambah.tsx`**

TanStack Router file-based: `produk-het.tambah.tsx` → `/admin/produk-het/tambah`

```tsx
import { ProductHetForm } from "@/features/product-het/components/product-het-form"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/tambah")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Tambah Produk HET</h1>
        <p className="text-muted-foreground mt-2">Isi form untuk menambahkan produk baru.</p>
      </div>
      <ProductHetForm />
    </div>
  )
}
```

---

### Step 7: Edit Route — `/admin/produk-het/$id/edit`

**`app/src/routes/_authenticated/admin/produk-het_.$id.edit.tsx`**

Uses router loader with `queryClient.ensureQueryData()`:

```tsx
import { ProductHetForm } from "@/features/product-het/components/product-het-form"
import { getProductHetByIdQueryOptions } from "@/features/product-het/queries/product-het.queries"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het/$id/edit")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(getProductHetByIdQueryOptions(params.id)),
  component: RouteComponent,
})

function RouteComponent() {
  const product = Route.useLoaderData()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Produk HET</h1>
        <p className="text-muted-foreground mt-2">Perbarui informasi produk.</p>
      </div>
      <ProductHetForm initialData={product} />
    </div>
  )
}
```

---

### Step 8: Wire "Tambah" Button

**`app/src/routes/_authenticated/admin/produk-het.tsx`** — Change:

```diff
- <Button>Tambah</Button>
+ <Button asChild>
+   <Link to="/admin/produk-het/tambah">Tambah</Link>
+ </Button>
```

Add import: `import { Link } from "@tanstack/react-router"`

---

## Dependencies

No new packages needed. All deps already installed:
- `@tanstack/react-form` ✓
- `@tanstack/react-query` ✓
- `@tanstack/react-router` ✓
- `zod` v4 ✓
- Shadcn `field.tsx`, `input.tsx`, `button.tsx`, `alert.tsx` ✓

---

## Notes

- After creating route files, run `pnpm dev` to regenerate `routeTree.gen.ts`
- Backend `productHetSchema` already validates + transforms — frontend schema mirrors it for consistent UX
- Price input uses `type="number"` — `z.coerce.number()` converts string → number
- `form.Subscribe` watches `canSubmit`, `isDirty`, `isSubmitting` — button disabled until valid + dirty + not submitting
- Edit route loader uses `ensureQueryData` — fetches if not cached, serves from cache if available
- Both create/update mutations invalidate `productHetKeys.all` — list page auto-refreshes on navigate back
