# APP (Frontend) — PROJECT KNOWLEDGE BASE

**Updated:** 2026-05-21

## OVERVIEW

React 19 · TanStack Router · TanStack Query · TanStack Form · Zod v4 · shadcn/ui · Tailwind CSS v4 · React Compiler · Vite 8 · TypeScript 6

## COMMANDS

| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` (port 5173) |
| Build | `pnpm build` |
| Test | `pnpm test` (vitest) |
| Lint | `pnpm lint` |

## ARCHITECTURE

- **Auth**: `AuthProvider` → `RouterProvider`. Two-level guard: `_authenticated` (isAuthenticated) → `_authenticated/admin` (role check).
- **Routing**: File-based (TanStack Router). Auto-generated `routeTree.gen.ts`. Run dev server to regenerate.
- **Data fetching**: `queryOptions` + `useSuspenseQuery` + `QueryBoundary`. Mutations invalidate key factory.
- **Forms**: Schema → hook → component. `validators: { onSubmit: schema }` only. Never `onChange`.
- **API clients**: `createHonoClient<T>()` per feature. Backend types imported from `backend/` package.
- **React Compiler**: Active. No manual `useMemo`/`useCallback`.
- **UI strings**: Indonesian.

## DOCUMENTATION

Detailed conventions and patterns live in `docs/`:

- [Feature Modules](./docs/feature-modules.md) — folder structure, naming, scaffolding checklist
- [Routing](./docs/routing.md) — file-based routing, layouts, auth guards, search params
- [Forms](./docs/forms.md) — schema → hook → component pattern, field rendering
- [Data Fetching](./docs/data-fetching.md) — query options, mutations, QueryBoundary, URL sync
- [API Clients](./docs/api-clients.md) — Hono client factory, backend type imports
- [Components](./docs/components.md) — component conventions, shadcn/ui, shared component catalog
- [Styling](./docs/styling.md) — Tailwind v4, container queries, Prettier, ESLint, import order

## KEY PATHS

| Concern | Path |
|---------|------|
| Routes | `src/routes/` |
| Features | `src/features/` |
| Shared components | `src/components/` |
| shadcn/ui | `src/components/ui/` |
| API clients | `src/lib/api/` |
| Auth client | `src/lib/auth-client.ts` |
| Auth provider | `src/auth.tsx` |
| Router config | `src/router.tsx` |
| Query client | `src/lib/query-client.ts` |
| Format utilities | `src/lib/format.ts` |
