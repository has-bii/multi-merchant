# Modules

## What is a Module?

A module is a self-contained feature unit under `src/modules/<name>/`. Each module owns one domain resource and follows the same layered structure:

```
src/modules/<name>/
├── index.ts        # Public export (composes routes)
├── schema.ts       # Zod validation schemas + derived DTO types
├── service.ts      # Business logic + DB access (abstract class)
└── route.ts        # HTTP wiring (middleware, validation, calls service, maps response)
```

## Sub-modules

When a module has a distinct domain concern with its own types and logic (e.g. import/batch operations), extract it as a sub-module:

```
src/modules/<name>/
├── index.ts                # Composes parent route + sub-module routes
├── schema.ts               # CRUD schemas + types
├── service.ts              # CRUD logic only (abstract class)
├── route.ts                # CRUD routes only
└── <concern>/              # Sub-module for distinct domain concern
    ├── schema.ts           # Schemas + derived types for this concern
    ├── types.ts            # Residual types not derivable from schemas
    ├── service.ts          # Concern-specific business logic (abstract class)
    └── route.ts            # Concern-specific routes
```

### Sub-module rules

1. **Own abstract class, own DB access.** Sub-modules have their own `Service` class with direct Prisma calls. They do **not** import from the parent's service — different error semantics (e.g. import handles uniqueness via bulk conflict resolution, not per-item HTTPException throws).
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
route → service (abstract class) → db (Prisma)
  │        │
  │        └── schema (DTO types)
  └── schema (request validation)
```

- **route** imports `service` class and `schema`.
- **service** imports `db` (Prisma client) and `schema` (for DTO types). Static methods only.
- **Sub-module service** has its own class, imports `db` directly (not parent service).
- **index** composes routes for `app.ts` to mount.

## Creating a New Module

1. Create `src/modules/<name>/` with the standard files.
2. Define Zod schemas in `schema.ts` — export schemas **and** derived types via `z.infer`.
3. Implement `service.ts` — abstract class with static methods. DB access + business logic, throws `HTTPException`.
4. Implement `route.ts` — HTTP wiring only, imports class from service.
5. Export via `index.ts` — `export { <name>Route } from "./route.js"`.
6. Mount in `app.ts`: `api.route("/<name>", <name>Route)`.

For sub-modules, repeat steps 2–4 inside `<module>/<concern>/`, then compose in the parent `index.ts`.
