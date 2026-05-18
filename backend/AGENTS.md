# BACKEND (API) — PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-19

## STRUCTURE
```
backend/
├── src/
│   ├── routes/              # Hono route modules
│   │   └── product-het.ts
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema (user, session, account, verification, productHets)
│   │   └── seed.ts          # Admin seeder
│   ├── config/
│   │   └── env.ts            # Typed env vars
│   ├── lib/
│   │   ├── auth.ts           # Better Auth config (drizzle adapter, admin plugin, cross-subdomain cookies)
│   │   └── db.ts             # Drizzle + Neon client
│   ├── app.ts                # Hono app (CORS, auth handler, routes)
│   └── dev.ts                # Dev server entry (@hono/node-server)
├── drizzle/                  # Migration files
├── drizzle.config.ts         # Drizzle Kit config
├── .prettierrc
├── tsconfig.json
└── .env.example              # BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL, DOMAIN, ORIGIN_ADMIN, ORIGIN_CLIENT, ADMIN_EMAIL, ADMIN_PASSWORD
```

## COMMANDS
| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` (port 3000) |
| Format | `pnpm format` |
| DB Generate | `pnpm db:generate` |
| DB Migrate | `pnpm db:migrate` |
| DB Studio | `pnpm db:studio` |
| DB Seed | `pnpm db:seed` |

## CODING STANDARDS
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Style**: Prettier (`printWidth: 100`, `semi: false`) + `@trivago/prettier-plugin-sort-imports`
- **Lint**: No dedicated linter
- **Framework**: Hono with `.basePath("/api")`, route modules exported as default
- **DB**: Drizzle ORM with Neon serverless, `uuid_generate_v7()` for PKs, camelCase columns
- **Validation**: Zod v4 (import from `zod/v4`)

## WHERE TO LOOK
- **Source**: `src/`
- **Routes**: `src/routes/`
- **DB schema**: `src/db/schema.ts`
- **Auth config**: `src/lib/auth.ts`
- **DB client**: `src/lib/db.ts`
- **Env vars**: `src/config/env.ts`
- **Hono app**: `src/app.ts`
- **Migrations**: `drizzle/`

## NOTES
- **Auth**: Better Auth with admin plugin, signup disabled (`disableSignUp: true`). Admin seeder creates initial user. Cross-subdomain cookies enabled.
- **CORS**: Allows `ORIGIN_ADMIN` and `ORIGIN_CLIENT` origins.
- **Language**: Validation messages in Indonesian.
- **DB Migrations**: Use `drizzle-kit generate` → `drizzle-kit migrate`. Neon serverless driver.
- **Monorepo**: Separate `pnpm-lock.yaml`, `package.json`, `.env`. Run commands from `backend/` directory.