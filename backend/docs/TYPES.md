# Types

## Purpose

Holds TypeScript types that **cannot be derived from Zod schemas** via `z.infer`. Everything that *can* be inferred from a schema must live in `schema.ts` — `types.ts` is for residue only.

## When to Create `types.ts`

Only at the module level when one or more of these conditions apply:

- **Response shapes** that don't correspond to a request schema (e.g. `ImportPreviewResponseDto` with `willCreate`, `willUpdate`, `ignored`).
- **Error/envelope types** (e.g. `ImportExecuteErrorRow`).
- **Composite DTOs** assembled from multiple schemas or external data.

If a type is a 1:1 mirror of a Zod schema, it belongs in `schema.ts` via `z.infer` — **not** in `types.ts`.

## Rules

1. **No duplication.** If a Zod schema defines the shape, derive it with `z.infer`. Do not hand-write an interface that mirrors a schema.
2. **Extend, don't repeat.** If a type builds on an inferred type, extend it:
   ```ts
   import type { ImportPreviewRow } from "./schema.js"

   export interface ImportPreviewWillUpdateRow extends ImportPreviewRow {
     id: string
     oldPrice: number
   }
   ```
3. **Keep residue small.** A module's `types.ts` should contain only the types that truly have no schema. If it grows past response shapes and error types, consider whether the missing schemas should exist.
4. **Sub-modules may have their own `types.ts`.** A sub-module like `import/` often has distinct response and error types. Place them in `<concern>/types.ts`, not in the parent.

## Example: Sub-module types

```ts
// src/modules/product-het/import/types.ts
import type { ImportPreviewRow } from "./schema.js"

export interface ImportPreviewWillUpdateRow extends ImportPreviewRow {
  id: string
  oldPrice: number
}

export interface ImportPreviewIgnoredRow {
  row: number
  name?: string
  reason: string
}

export interface ImportPreviewResponseDto {
  willCreate: ImportPreviewRow[]
  willUpdate: ImportPreviewWillUpdateRow[]
  ignored: ImportPreviewIgnoredRow[]
}
```

## Anti-patterns

- ❌ Hand-writing an interface that duplicates a Zod schema.
- ❌ Importing from `types.ts` when `z.infer<typeof someSchema>` is available.
- ❌ Putting response shapes in `types.ts` when they match a schema exactly.