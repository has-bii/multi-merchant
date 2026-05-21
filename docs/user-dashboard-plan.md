# User Dashboard Plan

## Overview

Add user dashboard with merchant management. Follows admin pattern.

**Routes:**
- `/user` — Dashboard (welcome message)
- `/user/merchant` — Merchant details (editable form)

**Flow:**
1. User logs in → redirects to `/user`
2. Layout checks `GET /api/merchant/me`
3. No merchant → renders merchant wizard (no sidebar, full screen)
4. Has merchant → renders sidebar + `<Outlet />` (dashboard/details)

---

## Phase 1: Route Structure + User Sidebar + Layout

### 1.1 Delete `user/dashboard.tsx`

- Remove `app/src/routes/_authenticated/user/dashboard.tsx`
- Regenerate route tree

### 1.2 Create `user/merchant.tsx`

- Flat route file at `app/src/routes/_authenticated/user/merchant.tsx`
- Placeholder component for now

### 1.3 Create `components/user-sidebar.tsx`

- Mirror admin sidebar pattern (`app-sidebar.tsx`)
- Nav items:
  - Dashboard (`/user`) — LayoutDashboard icon
  - Merchant Details (`/user/merchant`) — Building2 icon
- Header: "Multi Merchant" with BoxesIcon
- Footer: NavUser component

### 1.4 Update `user.tsx` (layout)

**Logic:**
```tsx
// In component:
const { data: merchant, isLoading } = useSuspenseQuery(merchantByUserQueryOptions())

if (isLoading) return <LoadingSpinner />

if (!merchant) {
  // No sidebar — full screen wizard
  return <MerchantCreationWizard />
}

// Has merchant — sidebar layout
return (
  <SidebarProvider>
    <UserSidebar />
    <SidebarInset>
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
)
```

**Query options:**
- Add `merchantKeys.byUser` to `features/merchant/queries/merchant.queries.ts`
- Add `getMerchantByUserQueryOptions()` — calls `GET /api/merchant/me`, returns merchant or null
- Handle 404 → return null (not error)

### 1.5 Update `user/index.tsx` (dashboard)

- Simple welcome message
- "Welcome to your account" + user name from auth context

### Files Modified
- `app/src/routes/_authenticated/user.tsx` — layout with merchant check
- `app/src/routes/_authenticated/user/index.tsx` — simplified dashboard
- `app/src/routes/_authenticated/user/merchant.tsx` — new placeholder
- `app/src/components/user-sidebar.tsx` — new sidebar component
- `app/src/features/merchant/queries/merchant.queries.ts` — add byUser query

### Files Deleted
- `app/src/routes/_authenticated/user/dashboard.tsx`

---

## Phase 2: Merchant Creation Wizard

### 2.1 Wizard Structure

**Location:** `app/src/features/merchant/components/merchant-wizard/`

**Files:**
```
merchant-wizard/
├── index.tsx              # Main wizard container + state management
├── step-welcome.tsx       # Step 1: Welcome screen
├── step-basic-info.tsx    # Step 2: Name + Description
├── step-details.tsx       # Step 3: Phone + Address
├── step-preview.tsx       # Step 4: Review all fields
├── step-success.tsx       # Step 5: Success message
└── use-merchant-wizard.ts # Hook for wizard state
```

### 2.2 Wizard Steps

| Step | Component | Fields | Validation |
|------|-----------|--------|------------|
| 1 | step-welcome | None | — |
| 2 | step-basic-info | name, description | name: required, trimmed, lowercase |
| 3 | step-details | phone, address | phone: `^08\d{8,12}$`, address: required |
| 4 | step-preview | Read-only summary | — |
| 5 | step-success | None | — |

### 2.3 Wizard Schema

**Location:** `app/src/features/merchant/schemas/merchant.schema.ts`

Add frontend Zod schema (mirror backend):
```ts
export const merchantFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").transform(v => v.trim().toLowerCase()),
  phone: z.string().min(1, "Telepon wajib diisi").regex(/^08\d{8,12}$/, "Nomor telepon harus diawali 08 dan panjang 10-14 karakter"),
  address: z.string().min(1, "Alamat wajib diisi"),
  description: z.string().optional(),
})

export type MerchantFormValues = z.infer<typeof merchantFormSchema>
```

### 2.4 Wizard Behavior

- **Navigation:** Back button on steps 2-4 (data persists)
- **Progress:** Step indicator (1/5, 2/5, etc.)
- **Submit:** On step 4 (Preview) → confirm button calls mutation
- **Success:** Step 5 shows briefly, then invalidates `merchantKeys.byUser`
- **Layout re-render:** Query invalidation → layout detects merchant → switches to sidebar + Outlet

### 2.5 Mutation

**Location:** `app/src/features/merchant/queries/merchant.queries.ts`

Add mutation:
```ts
export function useCreateMerchantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: MerchantFormValues) => {
      const res = await merchantClient.index.$post({ json: data })
      if (!res.ok) throw new Error("Gagal membuat merchant")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.byUser() })
    },
  })
}
```

### 2.6 UI Components

- Use shadcn/ui: Card, Button, Input, Textarea, Label, Progress
- Wizard container: centered card with max-width
- Step transitions: simple fade or instant

### Files Created
- `app/src/features/merchant/components/merchant-wizard/index.tsx`
- `app/src/features/merchant/components/merchant-wizard/step-welcome.tsx`
- `app/src/features/merchant/components/merchant-wizard/step-basic-info.tsx`
- `app/src/features/merchant/components/merchant-wizard/step-details.tsx`
- `app/src/features/merchant/components/merchant-wizard/step-preview.tsx`
- `app/src/features/merchant/components/merchant-wizard/step-success.tsx`
- `app/src/features/merchant/components/merchant-wizard/use-merchant-wizard.ts`

### Files Modified
- `app/src/features/merchant/schemas/merchant.schema.ts` — add frontend schema
- `app/src/features/merchant/queries/merchant.queries.ts` — add create mutation

---

## Phase 3: Merchant Details Page

### 3.1 Route: `user/merchant.tsx`

**Logic:**
```tsx
// Loader: prefetch merchant data
export const Route = createFileRoute("/_authenticated/user/merchant")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(getMerchantByUserQueryOptions())
  },
  component: MerchantPage,
})

function MerchantPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detail Merchant</h1>
      <MerchantDetailForm />
    </div>
  )
}
```

### 3.2 Component: `MerchantDetailForm`

**Location:** `app/src/features/merchant/components/merchant-detail-form.tsx`

- Always-editable form (no view/edit toggle)
- Pre-filled with current merchant data
- Fields: name, phone, address, description
- Save button at bottom
- Success: toast notification

### 3.3 Mutation: Update Merchant

**Location:** `app/src/features/merchant/queries/merchant.queries.ts`

```ts
export function useUpdateMerchantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: MerchantFormValues) => {
      const res = await merchantClient.index.$put({ json: data })
      if (!res.ok) throw new Error("Gagal memperbarui merchant")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.byUser() })
      toast.success("Merchant berhasil diperbarui")
    },
  })
}
```

### Files Created
- `app/src/features/merchant/components/merchant-detail-form.tsx`

### Files Modified
- `app/src/routes/_authenticated/user/merchant.tsx` — full implementation
- `app/src/features/merchant/queries/merchant.queries.ts` — add update mutation

---

## Phase 4: Cleanup

### 4.1 Verify

- [ ] Login as user → redirects to `/user`
- [ ] No merchant → wizard appears (no sidebar)
- [ ] Complete wizard → sidebar appears, dashboard loads
- [ ] Sidebar links work (Dashboard, Merchant Details)
- [ ] Merchant details form loads, edits work
- [ ] Back navigation in wizard preserves data
- [ ] 404 on `/api/merchant/me` handled gracefully

### 4.2 Edge Cases

- User refreshes during wizard → wizard state lost, restarts from step 1
- Merchant creation fails → show error in wizard, stay on step 4
- Network error → QueryBoundary catches, shows error state

---

## Backend Notes

No backend changes required. Existing endpoints:
- `GET /api/merchant/me` — get current user's merchant (404 if none)
- `POST /api/merchant` — create merchant (user role required)
- `PUT /api/merchant` — update merchant (user role required)

---

## Key Paths

| Concern | Path |
|---------|------|
| User layout | `src/routes/_authenticated/user.tsx` |
| Dashboard | `src/routes/_authenticated/user/index.tsx` |
| Merchant details | `src/routes/_authenticated/user/merchant.tsx` |
| User sidebar | `src/components/user-sidebar.tsx` |
| Merchant wizard | `src/features/merchant/components/merchant-wizard/` |
| Merchant queries | `src/features/merchant/queries/merchant.queries.ts` |
| Merchant schema | `src/features/merchant/schemas/merchant.schema.ts` |
