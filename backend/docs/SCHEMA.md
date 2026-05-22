# Schema

## Purpose

Defines Zod validation schemas for request validation and inferred TypeScript types (DTOs) used across layers.

## File: `src/modules/<name>/schema.ts`

## Rules

1. **Import Zod from `zod/v4`** — not `zod`.
2. **Body schemas** validate create/update payloads.
3. **Query schemas** extend the shared `querySchema` from `src/schemas/query.schema.ts`.
4. **Export types** using `z.infer<>` directly in schema.ts — no separate `types.ts`:

   ```ts
   export type ProductHetDto = z.infer<typeof productHetSchema>
   export type GetProductHetQueryDto = z.infer<typeof getProductHetQuerySchema>
   ```

5. **Sortable fields** — add `orderBy` and `order` to query schemas:
   ```ts
   orderBy: z.enum(["field1", "field2", "createdAt"]).default("createdAt"),
   order: z.enum(["asc", "desc"]).default("desc"),
   ```

6. **Validation messages** in Indonesian where user-facing.
7. **Transforms** are allowed and encouraged for canonicalization (e.g. `.transform((v) => v.trim().toLowerCase())`). Transforms are the single source of truth — callers should not re-apply the same normalization.
8. **Re-use parent schema transforms in sub-modules.** If a sub-module needs the same field normalization as the parent, use the parent's schema shape:
   ```ts
   // In sub-module service:
   const name = productHetSchema.shape.name.parse(rawInput)
   ```
   Don't duplicate the normalization logic.

## Template

```ts
import { z } from "zod/v4"

import { querySchema } from "../../schemas/query.schema.js"

export const productHetSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama wajib diisi" })
    .transform((v) => v.trim().toLowerCase()),
  price: z.coerce
    .number()
    .int({ message: "Harga harus bilangan bulat" })
    .positive({ message: "Harga harus lebih dari 0" }),
})

export const getProductHetQuerySchema = querySchema.extend({
  orderBy: z.enum(["name", "price", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type ProductHetDto = z.infer<typeof productHetSchema>
export type GetProductHetQueryDto = z.infer<typeof getProductHetQuerySchema>
```

## Where DTOs Flow

- **schema.ts** defines them via `z.infer`.
- **service.ts** accepts body/query DTOs as function parameters. Calls `db` directly with Prisma.
- **route.ts** validates requests against schemas, passes validated DTOs to service.

## When to Use `types.ts`

Only create a `types.ts` when the module has types **not derivable from Zod schemas** — response shapes, error shapes, or composite DTOs (e.g. `ImportPreviewResponseDto` with `willCreate`/`willUpdate`/`ignored` arrays). See [TYPES.md](./TYPES.md).
