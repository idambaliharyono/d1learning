# d1learning

SvelteKit app using Cloudflare D1 (database `d1learning-db`, binding `DB`) with Drizzle ORM.

## Quick reference

**Schema change loop**

1. Edit `src/lib/server/schema.ts`
2. `npm run db:generate` (creates a new file in `drizzle/`, review the SQL)
3. Apply it:
   - Remote: `npm run db:migrate` (drizzle-kit)
   - Local: `npx wrangler d1 migrations apply d1learning-db --local` (wrangler)

**Rules**

- One tool per database: drizzle-kit for remote, wrangler for local. Never both on the same DB, or you get "table already exists".
- Never edit old migration files. Every change is a new migration.
- Commit the `drizzle/` folder.

**Secrets (`.dev.vars`, gitignored)**

- `CLOUDFLARE_ACCOUNT_ID`: from `npx wrangler whoami`
- `CLOUDFLARE_DATABASE_ID`: from `npx wrangler d1 list`
- `CLOUDFLARE_D1_TOKEN`: API token, created on the Cloudflare dashboard (My Profile > API Tokens > Custom token > Account > D1 > Edit)
- Loaded in `drizzle.config.ts` with dotenv (`override: true`)

---

## 2026-10-13

**Did**

- Started keeping this log.
- Created the D1 database with `wrangler d1 create`.
- Set up secrets in `.dev.vars` (see Quick reference for where each value comes from).
- Wrote the first schema (`gym`, `user`) and migrated it with generate then migrate.
- Practiced changing the schema (new migration file, then migrate).

**Gotchas**

- `injected env (0)` from dotenv meant a variable already existed in the shell, so `override: true` was needed.
- Running wrangler migrations on a DB that drizzle-kit already migrated fails with "table already exists".
- Rotate the API token if it ever gets pasted anywhere public.
