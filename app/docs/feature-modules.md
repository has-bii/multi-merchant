# Feature Modules

## Structure

Every feature lives under `src/features/{feature-name}/` with this folder layout:

```
src/features/{feature-name}/
├── schemas/          # Zod schemas + inferred types
├── components/       # Feature-specific React components
├── hooks/            # Feature-specific hooks (form hooks, mutation hooks, selection hooks)
└── queries/          # TanStack Query queryOptions + key factory
```

## Naming Conventions

| Layer | File | Export |
|-------|------|--------|
| Schema | `schemas/{feature-name}.schema.ts` | `productHetSearchSchema`, `ProductHetSearch` |
| Form schema | `schemas/{feature-name}-form.schema.ts` | `productHetFormSchema`, `ProductHetFormValues` |
| Query | `queries/{feature-name}.queries.ts` | `productHetKeys`, `getProductHetQueryOptions()` |
| Hook | `hooks/use-{feature-name}-{purpose}.ts` | `useProductHetForm`, `useProductHetDelete` |
| Component | `components/{feature-name}-{purpose}.tsx` | `ProductHetForm`, `ProductHetTable` |

- Files: `kebab-case`
- Exports: `PascalCase` for components and types, `camelCase` for functions and schemas
- Feature name prefix on every export to avoid collisions

## What Goes Where

| File type | Location | Example |
|-----------|----------|---------|
| Zod validation schema | `schemas/` | `product-het.schema.ts` (search params), `product-het-form.schema.ts` (form input) |
| React Query queryOptions | `queries/` | `product-het.queries.ts` |
| Form hook (useForm + mutation) | `hooks/` | `use-product-het-form.ts` |
| Action hook (delete, selection) | `hooks/` | `use-product-het-delete.ts` |
| UI component | `components/` | `product-het-table.tsx` |
| Dialog / sub-component | `components/` | `product-het-delete-dialog.tsx` |

## Cross-Feature Imports

- Features may import from `@/lib/`, `@/components/`, `@/hooks/`
- Features may import from other features' `queries/` and `schemas/` (read-only data)
- Features should **not** import from other features' `hooks/` or `components/` — extract to shared if needed

## Scaffolding a New Feature

1. Create `src/features/{name}/` with `schemas/`, `components/`, `hooks/`, `queries/` folders
2. Add search schema in `schemas/{name}.schema.ts` (if list page needed)
3. Add form schema in `schemas/{name}-form.schema.ts` (if CRUD needed)
4. Add API client in `src/lib/api/{name}.ts`
5. Add query options + key factory in `queries/{name}.queries.ts`
6. Add route files in `src/routes/` (see [routing.md](./routing.md))
7. Add form hook in `hooks/use-{name}-form.ts` (see [forms.md](./forms.md))
8. Add components in `components/` (see [components.md](./components.md))
9. Add sidebar entry in `src/components/app-sidebar.tsx` (if admin feature)
10. Run dev server to regenerate `routeTree.gen.ts`
