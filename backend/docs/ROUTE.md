# ROUTE.md

## Purpose

HTTP wiring layer. Validates input via Zod, calls service, maps results to HTTP responses. No business logic.

## File: `src/modules/<name>/route.ts`

## Rules

1. **Import service** with `import * as service from "./service.js"`.
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
6. **Response mapping**:
   - `200` — `c.json(await service.getXxx(id))`
   - `201` — `c.json(await service.createXxx(body), 201)`
   - `204` — `c.body(null, 204)` for deletes
7. **Let `HTTPException` propagate** — don't catch service errors in route. Hono's error handler will respond.

## Template

```ts
import { requireAdmin, requireAuth } from "../../middlewares/auth.js"
import { createApp } from "../../lib/typed-app.js"
import { zValidator } from "../../middlewares/validator.js"
import * as service from "./service.js"
import { <name>Schema, get<Name>QuerySchema } from "./schema.js"

export const <name>Route = createApp()
  .get("/", requireAuth, zValidator("query", get<Name>QuerySchema), async (c) => {
    return c.json(await service.list(c.req.valid("query")))
  })
  .get("/:id", requireAuth, async (c) => {
    return c.json(await service.getXxx(c.req.param("id")))
  })
  .post("/", requireAdmin, zValidator("json", <name>Schema), async (c) => {
    return c.json(await service.createXxx(c.req.valid("json")), 201)
  })
  .put("/:id", requireAdmin, zValidator("json", <name>Schema), async (c) => {
    return c.json(await service.updateXxx(c.req.param("id"), c.req.valid("json")))
  })
  .delete("/:id", requireAdmin, async (c) => {
    await service.deleteXxx(c.req.param("id"))
    return c.body(null, 204)
  })
```

## Anti-Patterns

- ❌ Business logic in route handlers (e.g. uniqueness checks, existence checks).
- ❌ Direct DB imports or repository calls — always go through service.
- ❌ Manual validation error handling — `zValidator` middleware handles it.