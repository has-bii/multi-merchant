# MODULES.md

## What is a Module?

A module is a self-contained feature unit under `src/modules/<name>/`. Each module owns one domain resource and follows the same layered structure:

```
src/modules/<name>/
├── index.ts        # Public export (re-exports route)
├── schema.ts       # Zod validation schemas + DTO types
├── repository.ts   # Database adapter (all Drizzle queries)
├── service.ts      # Business logic (validation, uniqueness, domain errors)
└── route.ts         # HTTP wiring (middleware, validation, calls service, maps response)
```

## Layer Dependencies

```
route → service → repository → db
  │        │
  │        └── schema (DTO types)
  └── schema (request validation)
```

- **route** imports `service` and `schema`.
- **service** imports `repository` and `schema` (for DTO types).
- **repository** imports `db` and the centralized `db/schema.ts`.
- **index** re-exports the route for `app.ts` to mount.

## Creating a New Module

1. **Add the DB table** in `src/db/schema.ts` (and run `pnpm db:generate` + `pnpm db:migrate`).
2. **Create the module directory**: `src/modules/<name>/`.
3. **Write each layer** in order: `schema.ts` → `repository.ts` → `service.ts` → `route.ts` → `index.ts`.
4. **Mount the route** in `src/app.ts`:
   ```ts
   import { <name>Route } from "./modules/<name>/index.js"
   api.route("/<name>", <name>Route)
   ```
5. **Update `CONTEXT.md`** with the new domain term.

See individual docs for each layer:
- [SCHEMA.md](./SCHEMA.md)
- [REPOSITORY.md](./REPOSITORY.md)
- [SERVICE.md](./SERVICE.md)
- [ROUTE.md](./ROUTE.md)