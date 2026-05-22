# Route

## Purpose

HTTP wiring layer. Validates input via Zod, calls service, maps results to HTTP responses. No business logic.

## File: `src/modules/<name>/route.ts`

## Rules

1. **Import service class** as a named import:
   ```ts
   import { MerchantService } from "./service.js"
   ```
2. **Use `createApp()`** from `src/lib/typed-app.ts` for typed Hono instances:
   ```ts
   export const <name>Route = createApp()
   ```
3. **Use the shared `zValidator`** from `src/middlewares/validator.ts` — it throws `HTTPException` on validation failure automatically:
   ```ts
   zValidator("json", <name>Schema)
   zValidator("query", get<Name>QuerySchema)
   ```
4. **Apply auth middleware** per route:
   - `requireAuth` — any authenticated user.
   - `requireAdmin` — admin-only mutations.
5. **Extract validated data** via `c.req.valid("json")` or `c.req.valid("query")`. Pass DTOs to service.
6. **Call service static methods** directly on the class:
   ```ts
   return c.json(await MerchantService.list(c.req.valid("query")))
   ```
7. **Response mapping**:
   - `200` — `c.json(await <Name>Service.getById(id))`
   - `201` — `c.json(await <Name>Service.create(body), 201)`
   - `204` — `c.body(null, 204)` for deletes
8. **Let `HTTPException` propagate** — don't catch service errors in route. Hono's error handler will respond.

## Template

```ts
import { <Name>Service } from "./service.js"
import { createApp } from "../../lib/typed-app.js"
import { requireAdmin, requireAuth } from "../../middlewares/auth.js"
import { zValidator } from "../../middlewares/validator.js"
import { <name>Schema, get<Name>QuerySchema } from "./schema.js"

export const crudRoute = createApp()
  .get("/", requireAuth, zValidator("query", get<Name>QuerySchema), async (c) => {
    return c.json(await <Name>Service.list(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    return c.json(await <Name>Service.getById(c.req.param("id")))
  })
  .post("/", requireAdmin, zValidator("json", <name>Schema), async (c) => {
    return c.json(await <Name>Service.create(c.req.valid("json")), 201)
  })
  .put("/:id", requireAdmin, zValidator("json", <name>Schema), async (c) => {
    return c.json(await <Name>Service.update(c.req.param("id"), c.req.valid("json")))
  })
  .delete("/:id", requireAdmin, async (c) => {
    await <Name>Service.delete(c.req.param("id"))
    return c.body(null, 204)
  })
```

## Route concerns vs Service concerns

Route handles **HTTP mechanics**:
- Body size limits (`bodyLimit`)
- File extraction (`c.req.parseBody()`)
- Auth middleware (`requireAuth`, `requireAdmin`)
- Request validation via Zod schemas

Service handles **domain semantics**:
- What file formats are valid (`.csv`, `.xlsx`)
- Business rule validation (max rows, data conflict resolution)
- Any decision that would remain true regardless of transport layer

When in doubt: "Would this rule apply if the same logic were called from a CLI instead of HTTP?" If yes → service.

## Anti-patterns

- ❌ Business logic in route handlers (e.g. uniqueness checks, existence checks).
- ❌ Direct `db` imports — always go through service.
- ❌ Manual validation error handling — `zValidator` middleware handles it.
- ❌ Domain validation in route (e.g. checking file extensions belongs in service, not route).
