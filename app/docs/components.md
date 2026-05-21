# Components

## Where to Put Components

| Location | Purpose | Examples |
|----------|---------|---------|
| `src/components/ui/` | shadcn/ui primitives — managed by CLI | `button.tsx`, `card.tsx`, `field.tsx` |
| `src/components/` | Shared app-level components | `query-boundary.tsx`, `header.tsx`, `sortable-header.tsx` |
| `src/features/{name}/components/` | Feature-specific components | `product-het-table.tsx`, `login-form.tsx` |

**Decision rule:**
- Used by only one feature → `features/{name}/components/`
- Used across features or in routes → `src/components/`
- shadcn/ui primitive → `src/components/ui/` (via CLI only)

## Component Conventions

- **One component per file** — named export, no default export
- **File naming:** `kebab-case.tsx`
- **Export naming:** `PascalCase` (matches component name)
- **Props interface:** `XxxProps` — defined above the component, exported only if needed externally
- **Don't wrap with `useMemo`/`useCallback`** — React Compiler handles optimization

## shadcn/ui Components

`src/components/ui/` contains shadcn/ui components. **Do not edit these files by hand.**

### Adding Components

Use the shadcn CLI. For full documentation and options, refer to the **shadcn skill**.

```bash
pnpm dlx shadcn@latest add button
```

### Current Setup

- **Style:** `radix-vega`
- **Icon library:** `lucide-react`
- **CSS variables:** enabled
- **Base color:** `neutral`
- **Config:** `components.json` at project root

### Composing shadcn Components

Common composition patterns:

**Card layout:**
```tsx
<Card>
  <CardHeader className="text-center">
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

**Form field (with shadcn Field):**
```tsx
<Field data-invalid={isInvalid}>
  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
  <Input
    id={field.name}
    value={field.state.value}
    onChange={(e) => field.handleChange(e.target.value)}
    onBlur={field.handleBlur}
  />
  {isInvalid && <FieldError errors={field.state.meta.errors} />}
</Field>
```

**Alert (error display):**
```tsx
<Alert variant="destructive">
  <AlertTitle>Error Title</AlertTitle>
  <AlertDescription>{error}</AlertDescription>
</Alert>
```

## Shared App Components

### `QueryBoundary`

Wraps `useSuspenseQuery` content with `ErrorBoundary` + `Suspense`. Handles loading and error states.

```tsx
<QueryBoundary loadingFallback={<TableSkeleton columns={4} rows={10} />}>
  <DataComponent />
</QueryBoundary>
```

Props: `loadingFallback`, `errorFallback` (optional custom error renderer).

### `Header` / `MainPage`

Page layout primitives. Every authenticated page uses:

```tsx
<MainPage>
  <Header>
    <HeaderLeft>
      <HeaderBack className="@lg/main:hidden" linkOptions={{ to: ".." }} />
      <HeaderBreadcrumb className="hidden @lg/main:flex" items={[...]} />
    </HeaderLeft>
    <HeaderCenter className="@lg/main:hidden">
      <HeaderTitle>Title</HeaderTitle>
    </HeaderCenter>
    <HeaderRight />
  </Header>
  <MainPageContent>{/* content */}</MainPageContent>
</MainPage>
```

### `SortableHeader`

Table column header with sort toggle:

```tsx
<SortableHeader
  label="Nama"
  field="name"
  currentOrderBy={params.orderBy}
  currentOrder={params.order}
  onSortChange={toggleSort}
/>
```

### `DataTablePagination`

Pagination controls with page/limit selectors:

```tsx
<DataTablePagination
  page={data.pagination.page}
  totalPages={data.pagination.totalPages}
  total={data.pagination.total}
  limit={params.limit}
  onPageChange={(page) => update({ page })}
  onLimitChange={(limit) => update({ limit })}
/>
```

### `DebouncedSearch`

Search input with debounce:

```tsx
<DebouncedSearch
  value={params.search}
  onChange={(search) => update({ search })}
  placeholder="Cari..."
/>
```

### `TableEmptyState`

Empty table row message:

```tsx
<TableEmptyState headersLength={6} message="Tidak ada data ditemukan." />
```

### `TableSkeleton`

Loading skeleton for table rows:

```tsx
<TableSkeleton columns={4} rows={10} />
```

## Shared Hooks

### `useListState`

Syncs list params (search, page, sort, limit) with URL search params. Auto-resets page to 1 on non-page changes.

```tsx
const { params, update } = useListState({
  params: searchParams,
  onUpdate: (next) => navigate({ search: next, replace: true }),
  onReset: clearSelection, // optional — e.g. clear row selection on param change
})
```

### `use-mobile`

Detects mobile viewport. Used for responsive sidebar behavior.

## Icons

Use `lucide-react` for all icons. Import individually:

```ts
import { Trash2, Pencil, MoreHorizontal } from "lucide-react"
```

Use `size-4` class for 16px icons in buttons/tables.
