# Modules

## What is a Module?

A module is a self-contained feature unit under `src/modules/<name>/`. Each module owns one domain resource and follows the same layered structure:

```
src/modules/<name>/
├── index.ts        # Public export (composes routes)
├── schema.ts       # Zod validation schemas + derived DTO types
├── repository.ts   # Database adapter (all Drizzle queries)
├── service.ts      # Business logic (validation, uniqueness, domain errors)
└── route.ts        # HTTP wiring (middleware, validation, calls service, maps response)
```

## Sub-modules

When a module has a distinct domain concern with its own types and logic (e.g. import/batch operations), extract it as a sub-module:

```
src/modules/<name>/
├── index.ts                # Composes parent route + sub-module routes
├── schema.ts               # CRUD schemas + types
├── repository.ts
├── service.ts              # CRUD logic only
├── route.ts                # CRUD routes only
└── <concern>/              # Sub-module for distinct domain concern
    ├── schema.ts           # Schemas + derived types for this concern
    ├── types.ts            # Residual types not derivable from schemas
    ├── service.ts          # Concern-specific business logic
    └── route.ts            # Concern-specific routes
```

### Sub-module rules

1. **Depends on parent's repository**, not parent's service. Sub-modules often have different error semantics (e.g. import handles uniqueness via bulk conflict resolution, not per-item HTTPException throws).
2. **Own schemas and types.** Import what you need from parent's `schema.ts` (e.g. re-use field transforms). Don't re-define parent fields.
3. **Parent `index.ts` composes both routes:**
   ```ts
   export const productHetRoute = createApp()
     .route("/", crudRoute)
     .route("/", importRoute)
   ```
4. **When to extract.** Apply the deletion test: if deleting the concern's logic from the parent service leaves a trivially thin CRUD layer, the concern earns its own module.

## Layer Dependencies

```
route → service → repository → db
  │        │
  │        └── schema (DTO types)
  └── schema (request validation)

Sub-module:
<concern>/route → <concern>/service → ../repository → db
  │                    │
  │                    └── <concern>/schema (DTO types)
  └── <concern>/schema (request validation)
```

- **route** imports `service` and `schema`.
- **service** imports `repository` and `schema` (for DTO types).
- **repository** imports `db` and the centralized `db/schema.ts`.
- **Sub-module service** imports `../repository.js` (not `../service.js`).
- **index** composes routes for `app.ts` to mount.

## Creating a New Module

1. Create `src/modules/<name>/` with the standard files.
2. Define Zod schemas in `schema.ts` — export schemas **and** derived types via `z.infer`.
3. Implement `repository.ts` — all Drizzle queries, no business logic.
4. Implement `service.ts` — business logic, throws `HTTPException`.
5. Implement `route.ts` — HTTP wiring only, no business logic.
6. Export via `index.ts` — `export { <name>Route } from "./route.js"`.
7. Mount in `app.ts`: `api.route("/<name>", <name>Route)`.

For sub-modules, repeat steps 2–5 inside `<module>/<concern>/`, then compose in the parent `index.ts`.