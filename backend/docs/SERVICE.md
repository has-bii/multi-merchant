# Service

## Purpose

Business logic layer. Enforces domain rules (uniqueness, existence, authorization constraints). Throws domain errors. Calls repository for data.

## File: `src/modules/<name>/service.ts`

## Rules

1. **Import repository** with `import * as repo from "./repository.js"`.
2. **Throw `HTTPException`** for domain errors with appropriate status codes:
   - `404` — resource not found
   - `409` — uniqueness conflict
   - `403` — authorization failure (though auth checks usually live in middleware)
3. **Accept DTOs** from schema as function parameters. Don't accept raw `c.req.valid()` — route passes DTOs in.
4. **Existence checks before mutations**:
   ```ts
   const product = await repo.findById(id)
   if (!product) throw new HTTPException(404, { message: "Produk tidak ditemukan" })
   ```
5. **Uniqueness checks** before create/update:
   ```ts
   const existing = await repo.findByName(data.name)
   if (existing && existing.id !== id) throw new HTTPException(409, { message: "Nama sudah digunakan" })
   ```
6. **Function naming**: `<verb><Resource>` — `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct`.
7. **Error messages in Indonesian** where user-facing.
8. **Canonicalization lives in schemas.** Use schema transforms (e.g. `.transform(v => v.toLowerCase())`) as the single source of truth. Don't re-normalize in service logic. When sub-modules need the same normalization, use the parent's schema shape: `parentSchema.shape.field.parse(rawInput)`.
9. **Domain validation lives in service, not route.** If a validation rule crosses multiple fields or requires DB state (e.g. "what file formats do we accept?"), it belongs in service. Route handles HTTP concerns (body size limits, file extraction); service handles domain semantics.

## Anti-patterns

- ❌ Direct `db` imports — use repository.
- ❌ HTTP response mapping (`c.json()`) — that's route's job.
- ❌ Zod validation — that's schema + route's job.
- ❌ Duplicating schema transforms (e.g. re-lowercasing a name that the schema already lowercases).

## Sub-module Services

Sub-module services import from `../repository.js` — **not** `../service.js`. This is intentional: sub-modules (e.g. import) have different error handling semantics than CRUD operations. The repository is the correct seam for data access.