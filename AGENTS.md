# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-19

## OVERVIEW
Project: **multi-merchant**
Stack: React 19 · TanStack Router · Hono · Better Auth · Drizzle ORM · Neon (Postgres) · Tailwind CSS v4 · shadcn/ui · Vite 8 · TypeScript 6
Architecture: Monorepo — two separate `pnpm` packages (`app/` frontend, `backend/` API). No workspace root.

## STRUCTURE
```
multi-merchant/
├── app/                    # Frontend (React SPA)
│   ├── src/
│   │   ├── routes/         # TanStack Router file-based routes
│   │   │   ├── __root.tsx
│   │   │   ├── _authenticated.tsx   # Auth guard layout
│   │   │   ├── _authenticated/index.tsx
│   │   │   ├── _auth.tsx             # Unauthenticated layout
│   │   │   └── _auth/login.tsx
│   │   ├── features/       # Feature modules (schemas, components, hooks)
│   │   │   └── auth/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── lib/             # Utilities + auth client
│   │   │   ├── utils.ts
│   │   │   └── auth-client.ts
│   │   ├── auth.tsx         # AuthProvider context
│   │   ├── app.tsx          # App root (AuthProvider → RouterProvider)
│   │   ├── main.tsx         # Entry point
│   │   ├── router.tsx        # Router config
│   │   ├── routeTree.gen.ts # Auto-generated route tree
│   │   ├── types.ts         # Router context types
│   │   └── styles.css       # Tailwind + shadcn theme
│   ├── components.json      # shadcn config (radix-vega style)
│   ├── vite.config.ts       # Vite + React Compiler + Tailwind + TanStack Router plugin
│   ├── eslint.config.js     # @tanstack/eslint-config
│   ├── .prettierrc           # Prettier + import sorting
│   └── tsconfig.json         # Strict, ES2022, @/* paths
├── backend/                # API (Hono)
│   ├── src/
│   │   ├── routes/          # Hono route modules
│   │   │   └── product-het.ts
│   │   ├── db/
│   │   │   ├── schema.ts    # Drizzle schema (user, session, account, verification, productHets)
│   │   │   └── seed.ts      # Admin seeder
│   │   ├── config/
│   │   │   └── env.ts        # Typed env vars
│   │   ├── lib/
│   │   │   ├── auth.ts       # Better Auth config (drizzle adapter, admin plugin, cross-subdomain cookies)
│   │   │   └── db.ts         # Drizzle + Neon client
│   │   ├── app.ts            # Hono app (CORS, auth handler, routes)
│   │   └── dev.ts            # Dev server entry (@hono/node-server)
│   ├── drizzle/              # Migration files
│   ├── drizzle.config.ts     # Drizzle Kit config
│   ├── .prettierrc
│   ├── tsconfig.json
│   └── .env.example          # BETTER_AUTH_SECRET, BETTER_AUTH_URL, DATABASE_URL, DOMAIN, ORIGIN_ADMIN, ORIGIN_CLIENT, ADMIN_EMAIL, ADMIN_PASSWORD
└── AGENTS.md
```

## COMMANDS
| Action | App (cd app/) | Backend (cd backend/) |
|--------|---------------|----------------------|
| Install | `pnpm install` | `pnpm install` |
| Dev | `pnpm dev` (port 5173) | `pnpm dev` (port 3000) |
| Build | `pnpm build` | — |
| Test | `pnpm test` (vitest) | — |
| Lint | `pnpm lint` | — |
| Format | `pnpm format` | `pnpm format` |
| DB Generate | — | `pnpm db:generate` |
| DB Migrate | — | `pnpm db:migrate` |
| DB Studio | — | `pnpm db:studio` |
| DB Seed | — | `pnpm db:seed` |

## CODING STANDARDS
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Style**: Prettier (`printWidth: 100`, `semi: false`) + `@trivago/prettier-plugin-sort-imports`
- **Lint**: App — `@tanstack/eslint-config`; Backend — no dedicated linter
- **Imports**: Path alias `@/*` → `./src/*` in app
- **Framework patterns**:
  - App: TanStack Router file-based routing, route context for auth, feature-folder structure
  - Backend: Hono with `.basePath("/api")`, route modules exported as default
  - Auth: Better Auth with admin plugin, signup disabled, cross-subdomain cookies
  - DB: Drizzle ORM with Neon serverless, `uuid_generate_v7()` for PKs, camelCase columns
- **UI**: shadcn/ui (radix-vega style), Tailwind CSS v4, Inter Variable font
- **Validation**: Zod v4 (import from `zod/v4`)
- **React Compiler**: Enabled via `babel-plugin-react-compiler`

## WHERE TO LOOK
- **Frontend source**: `app/src/`
- **Frontend routes**: `app/src/routes/`
- **Frontend features**: `app/src/features/`
- **UI components**: `app/src/components/ui/`
- **Backend source**: `backend/src/`
- **DB schema**: `backend/src/db/schema.ts`
- **Auth config**: `backend/src/lib/auth.ts`
- **Env vars**: `backend/src/config/env.ts`
- **Migrations**: `backend/drizzle/`

## NOTES
- **Monorepo without workspace root**: Each sub-project (`app/`, `backend/`) has its own `pnpm-lock.yaml`, `package.json`, and `.env`. Run commands from the respective directory.
- **Better Auth**: Signup disabled (`disableSignUp: true`). Admin seeder creates initial user. Cross-subdomain cookies enabled.
- **Auth flow**: Frontend `AuthProvider` wraps `RouterProvider`. Authenticated routes check `context.auth.isAuthenticated` in `beforeLoad`, redirect to `/login`.
- **CORS**: Backend allows `ORIGIN_ADMIN` and `ORIGIN_CLIENT` origins.
- **Language**: UI strings in Indonesian (e.g., validation messages: "Email tidak valid", "Password minimal 6 karakter").
- **React Compiler**: Active. Auto-optimizes re-renders. Don't wrap with `useMemo`/`useCallback` unnecessarily.
- **TanStack Router**: Route tree auto-generated (`routeTree.gen.ts`). Run dev server to regenerate after route file changes.
- **DB Migrations**: Use `drizzle-kit generate` → `drizzle-kit migrate`. Neon serverless driver.