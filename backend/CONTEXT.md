# CONTEXT.md

## Domain Glossary

- **Product (HET)** — Harga Eceran Tertinggi. The maximum retail price for a product, set by regulators. Each Product has a unique name and a price (the HET value).
- **User** — An authenticated person. Roles: `admin`, `user`.
- **Session** — An active authentication session tied to a User.
- **Account** — A third-party authentication credential linked to a User.

## Architecture

- **Layered modules** — each module under `src/modules/<name>/` contains: `repository.ts` (DB adapter), `service.ts` (business logic), `route.ts` (HTTP wiring), `schema.ts` (validation), `index.ts` (public export).
- **Centralized DB schema** — all Drizzle table definitions live in `src/db/schema.ts`.
- **Repository pattern** — service imports repository; repository encapsulates all Drizzle queries and type coercion (e.g. `numeric` ↔ `number`).
- **Shared pagination** — `src/lib/paginate.ts` provides generic `paginate()` used by all list endpoints.
