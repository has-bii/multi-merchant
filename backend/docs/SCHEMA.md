# SCHEMA.md

## Purpose

Defines Zod validation schemas for request validation and inferred TypeScript types (DTOs) used across layers.

## File: `src/modules/<name>/schema.ts`

## Rules

1. **Import Zod from `zod/v4`** — not `zod`.
2. **Body schemas** validate create/update payloads.
3. **Query schemas** extend the shared `querySchema` from `src/schemas/query.schema.ts`.
4. **Export types** using `z.infer<>`:

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
7. **Transforms** are allowed (e.g. `.transform((v) => v.toLowerCase())`).

## Template

```ts
import { z } from "zod/v4"
import { querySchema } from "../../schemas/query.schema.js"

export const <name>Schema = z.object({
  name: z.string().min(1, { message: "Nama wajib diisi" }),
  // ... fields
})

export const get<Name>QuerySchema = querySchema.extend({
  orderBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
})

export type <Name>Dto = z.infer<typeof <name>Schema>
export type Get<Name>QueryDto = z.infer<typeof get<Name>QuerySchema>
```

## Where DTOs Flow

- **schema.ts** defines them.
- **repository.ts** accepts query DTOs as input (typed params).
- **service.ts** accepts body/query DTOs, passes them to repository.
- **route.ts** validates requests against schemas, passes validated DTOs to service.