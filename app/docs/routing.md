# Routing

## File-Based Routing

TanStack Router with `@tanstack/router-plugin`. Route files live in `src/routes/`. Route tree is auto-generated to `src/routeTree.gen.ts`.

**Run dev server after adding/removing route files** to regenerate the tree.

## Route File Pattern

```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/admin/produk-het")({
  // Optional: beforeLoad, validateSearch, loader
  component: RouteComponent,
})

function RouteComponent() {
  // Route UI here
}
```

- `Route` export is required — this is how the plugin discovers routes
- `RouteComponent` is the default name for the component
- Layout routes use `<Outlet />` to render children

## Layout Routes

Pathless routes (prefixed with `_`) are layout routes — they don't add a URL segment.

### Auth Guard Layout (`_authenticated.tsx`)

All authenticated routes go under `_authenticated/`. This layout checks auth in `beforeLoad`:

```tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }
  },
  component: RouteComponent,
})
```

### Unauthenticated Layout (`_auth.tsx`)

Login, forgot-password, reset-password routes go under `_auth/`. Centered card layout, no sidebar.

### Admin Layout (`_authenticated/admin.tsx`)

Admin routes go under `_authenticated/admin/`. Adds **role guard** + sidebar:

```tsx
export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.user?.role !== "admin") {
      throw redirect({
        to: "/user",
        search: { redirect: location.href },
      })
    }
  },
  component: RouteComponent,
})
```

Component wraps children in `<SidebarProvider>` + `<AppSidebar>` + `<SidebarInset>`.

## Two-Level Auth Guard

1. **`_authenticated`** — `isAuthenticated` check → redirect to `/login`
2. **`_authenticated/admin`** — `user.role === "admin"` check → redirect to `/user`

Place routes under the correct layout path. Never add auth checks inside components.

## Search Params

List pages use `validateSearch` with a Zod schema to type and default URL search params:

```tsx
export const Route = createFileRoute("/_authenticated/admin/produk-het/")({
  validateSearch: productHetSearchSchema,
  component: RouteComponent,
})
```

Schema provides defaults (page=1, limit=10, order=desc, etc.) so URL is always valid.

Update search params via `navigate({ search: next, replace: true })` — keeps URL in sync without history entries.

## Page Layout Convention

Every authenticated page follows this structure:

```tsx
<MainPage>
  <Header>
    <HeaderLeft>
      <HeaderBack className="@lg/main:hidden" linkOptions={{ to: ".." }} />
      <HeaderBreadcrumb className="hidden @lg/main:flex" items={[...]} />
    </HeaderLeft>
    <HeaderCenter className="@lg/main:hidden">
      <HeaderTitle>Page Title</HeaderTitle>
    </HeaderCenter>
    <HeaderRight />
  </Header>

  <MainPageContent>
    {/* Page content */}
  </MainPageContent>
</MainPage>
```

- `HeaderBack` + `HeaderCenter` visible on mobile
- `HeaderBreadcrumb` visible on desktop (`@lg/main:`)
- `HeaderRight` for action buttons

## Route Directory Structure

```
src/routes/
├── __root.tsx                              # Root layout (Toaster, TooltipProvider)
├── _authenticated.tsx                       # Auth guard
├── _authenticated/
│   ├── index.tsx                           # Authenticated home
│   ├── user.tsx                            # User layout
│   ├── user/
│   │   ├── index.tsx
│   │   └── dashboard.tsx
│   ├── admin.tsx                           # Admin guard + sidebar
│   └── admin/
│       ├── index.tsx
│       └── produk-het/
│           ├── index.tsx                   # List page
│           ├── tambah.tsx                  # Create page
│           ├── $id.edit.tsx                # Edit page (dynamic param)
│           └── import.tsx                  # Import page
├── _auth.tsx                               # Unauthenticated layout
└── _auth/
    ├── login.tsx
    ├── forgot-password.tsx
    └── reset-password.tsx
```

Dynamic route params use `$paramName` syntax: `$id.edit.tsx` → `:id` param.
