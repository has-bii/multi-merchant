# Service

## Purpose

Business logic + data access layer. Enforces domain rules (uniqueness, existence, authorization constraints). Throws domain errors. Contains all Prisma queries.

## File: `src/modules/<name>/service.ts`

## Rules

1. **Abstract class with static methods.** No instantiation. No inheritance.
   ```ts
   export abstract class MerchantService {
     static async list(...) { ... }
     static async getById(...) { ... }
     static async create(...) { ... }
   }
   ```
2. **Direct Prisma access** via `import { db } from "../../lib/db.js"`. No separate repository layer.
3. **Throw `HTTPException`** for domain errors with appropriate status codes:
   - `404` — resource not found
   - `409` — uniqueness conflict
   - `403` — authorization failure (though auth checks usually live in middleware)
4. **Accept DTOs** from schema as function parameters. Don't accept raw `c.req.valid()` — route passes DTOs in.
5. **Existence checks before mutations**:
   ```ts
   static async delete(id: string) {
     const product = await db.productHets.findUnique({ where: { id } })
     if (!product) throw new HTTPException(404, { message: "Produk tidak ditemukan" })
     await db.productHets.delete({ where: { id } })
   }
   ```
6. **Uniqueness checks** before create/update:
   ```ts
   static async create(data: { name: string; price: number }) {
     const existing = await this.findByName(data.name)
     if (existing) throw new HTTPException(409, { message: "Nama sudah digunakan" })
     return db.productHets.create({ data: { name: data.name, price: String(data.price) } })
   }
   ```
7. **Use `this.` for cross-method calls** within the same class:
   ```ts
   static async update(id: string, data: ...) {
     const existing = await this.findByName(data.name)
   }
   ```
8. **Private helpers** for internal queries that aren't part of the public API:
   ```ts
   private static async findByName(name: string) {
     return db.productHets.findUnique({ where: { name } })
   }
   ```
9. **Use `paginate()`** from `src/lib/paginate.ts` for list queries:
   ```ts
   static async list(query: GetProductHetQueryDto) {
     return paginate(
       (l, o) => db.productHets.findMany({ where, take: l, skip: o, orderBy: ... }),
       async () => db.productHets.count({ where }),
       query.page,
       query.limit,
     )
   }
   ```
10. **Type coercion** (e.g. `String(data.price)` for `decimal` columns) stays in service.
11. **Function naming**: camelCase — `list`, `getById`, `create`, `update`, `delete`, `bulkDelete`.
12. **Error messages in Indonesian** where user-facing.
13. **Canonicalization lives in schemas.** Use schema transforms (e.g. `.transform(v => v.toLowerCase())`) as the single source of truth. Don't re-normalize in service logic. When sub-modules need the same normalization, use the parent's schema shape: `parentSchema.shape.field.parse(rawInput)`.
14. **Domain validation lives in service, not route.** If a validation rule crosses multiple fields or requires DB state (e.g. "what file formats do we accept?"), it belongs in service. Route handles HTTP concerns (body size limits, file extraction); service handles domain semantics.

## Anti-patterns

- ❌ Instantiating the class (`new MerchantService()`).
- ❌ HTTP response mapping (`c.json()`) — that's route's job.
- ❌ Zod validation — that's schema + route's job.
- ❌ Duplicating schema transforms (e.g. re-lowercasing a name that the schema already lowercases).

## Sub-module Services

Sub-module services have their **own abstract class** with their own Prisma calls. They do **not** import from the parent service. This is intentional: sub-modules (e.g. import) have different error handling semantics than CRUD operations.

```ts
// product-het/import/service.ts
import { db } from "../../../lib/db.js"

export abstract class ProductHetImportService {
  static async preview(...) { ... }
  static async execute(...) { ... }
}
```
