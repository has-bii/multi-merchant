# REPOSITORY.md

## Purpose

The repository is the **database adapter layer**. It encapsulates all Drizzle queries and type coercion. No business logic lives here.

## File: `src/modules/<name>/repository.ts`

## Rules

1. **All Drizzle queries live here.** Service and route never import from `drizzle-orm` or touch `db` directly.
2. **Type coercion** (e.g. `String(data.price)` for `numeric` columns) stays in the repository. Callers pass native types.
3. **Use `paginate()`** from `src/lib/paginate.ts` for all list queries:
   ```ts
   export async function list(query: Get<Name>QueryDto) {
     return paginate(
       (limit, offset) => db.query.<table>.findMany({ limit, offset, orderBy: ... }),
       async () => { const [row] = await db.select({ count: count() }).from(<table>); return row?.count ?? 0 },
       query.page,
       query.limit,
     )
   }
   ```
4. **Sorting**: map DTO `orderBy`/`order` fields to Drizzle columns in the `findMany` callback:
   ```ts
   const sortableFields = { name: "name", createdAt: "createdAt" } as const

   orderBy: (row, { asc, desc }) => [
     query.order === "asc" ? asc(row[sortableFields[query.orderBy]]) : desc(row[sortableFields[query.orderBy]]),
   ]
   ```
5. **Function naming**: `list`, `findById`, `findByName`, `create`, `update`, `remove`. Keep it flat — no classes.
6. **Import the table** from centralized schema: `import { <table> } from "../../db/schema.js"`.
7. **Return raw Drizzle rows**. Don't reshape — let service handle mapping if needed.

## Anti-Patterns

- ❌ Business checks in repository (e.g. "throw if not found"). That's service's job.
- ❌ Re-exporting Drizzle types. Let TypeScript infer.
- ❌ Raw SQL when Drizzle query API works.