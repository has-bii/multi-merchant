# SERVICE.md

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

## Anti-Patterns

- ❌ Direct `db` imports — use repository.
- ❌ HTTP response mapping (`c.json()`) — that's route's job.
- ❌ Zod validation — that's schema + route's job.

## Future Note

When tests arrive, these `HTTPException` throws should become domain-specific errors (e.g. `ProductNotFoundError`, `DuplicateNameError`). The route layer will map those to HTTP statuses. This makes service testable without Hono dependencies.