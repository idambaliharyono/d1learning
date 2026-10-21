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

## 2026-10-20

## What was built

| Piece                                        | File                                               |
| -------------------------------------------- | -------------------------------------------------- |
| Auth factory (per request)                   | `src/lib/server/auth.ts` (`createAuth(env)`)       |
| CLI-only auth stub (schema generation)       | `src/lib/server/auth.cli.ts`                       |
| Request hook (mounts handler, sets `locals`) | `src/hooks.server.ts`                              |
| Browser client                               | `src/lib/auth-client.ts`                           |
| Login page (+ redirect if signed in)         | `src/routes/login/+page.svelte`, `+page.server.ts` |
| Protected area guard                         | `src/routes/user/+layout.server.ts`                |
| Types for `locals` and `platform`            | `src/app.d.ts`                                     |
| Auth tables + app tables                     | `src/lib/server/db/auth.schema.ts`, `schema.ts`    |
| Secrets (local)                              | `.dev.vars`                                        |

## Key concepts learned

1. **`BETTER_AUTH_URL` is just your app's own origin.** `localhost:3000` in the docs is only an example. SvelteKit dev is `5173`. It must match exactly where you browse, and in production it becomes your real domain, set in Cloudflare, not in `.env`.
2. **Workers need `createAuth(env)` per request.** The D1 binding and secrets only exist per request, so you can't export a top-level `auth` like a normal Node backend.
3. **That's why `auth.cli.ts` exists.** The Better Auth CLI needs a top-level exported `auth` to read the schema from. It is a throwaway file with a dummy adapter and fake credentials, only used for `npx auth generate`.
4. **Two ways to reach D1.** `drizzle.config.ts` uses the HTTP API with a token (CLI on your machine only). The running app uses the `env.DB` binding, so the D1 token never goes to production.
5. **Separate identity from role.** `user` is the login identity. `coach`, `manager`, etc. are domain profiles linked through `userId`.
6. **`export * from` doesn't bring names into scope.** You need a normal `import { user }` as well as the re-export.

## Sticking points, in the order they hit

| #   | Symptom                                             | Cause                                                            | Fix                                                                                    |
| --- | --------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | `Env` / `DB` / secrets not found                    | Types not generated                                              | `npx wrangler types`, include `worker-configuration.d.ts`                              |
| 2   | CLI: "Couldn't read your auth config"               | `auth.ts` exports a function, not `auth`                         | Create `auth.cli.ts`, pass `--config` and `--output`                                   |
| 3   | CLI: "memory is not supported"                      | No database adapter in the CLI file                              | Stub `drizzleAdapter({} as any, { provider: 'sqlite' })`                               |
| 4   | `$lib` unresolved, `module_removed_lib` build error | **SvelteKit 3 removed `$lib`**                                   | Use `#lib/*` (from `"imports"` in `package.json`) everywhere                           |
| 5   | tsconfig `$app/tsconfig` not found                  | That `extends` is valid in this SvelteKit generation             | Leave it alone. Changing it caused extra errors                                        |
| 6   | `event.platform` undefined (500)                    | Newer adapter dropped `platform.env` in dev                      | `import { env } from 'cloudflare:workers'` in the hook                                 |
| 7   | "Drizzle schema mismatch: Missing tables"           | **Schema not passed to `drizzle()` and `drizzleAdapter()`**      | `drizzle(env.DB, { schema })` and `drizzleAdapter(db, { provider: 'sqlite', schema })` |
| 8   | `/api/auth/*` returned 404                          | Port / `BETTER_AUTH_URL` mismatch (5173 vs 5174 vs 8787)         | One running server, `strictPort: true`, matching URL                                   |
| 9   | Google `redirect_uri_mismatch`                      | **Console had `https://localhost`, app uses `http://localhost`** | Register `http://localhost:5173/api/auth/callback/google`                              |

Sticking points 7 and 9 were the real blockers. Both were tiny (a missing argument, one letter in a URL) but produced errors that pointed somewhere else.

## Working configuration (essentials)

**`.dev.vars`** (gitignored)

```
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:5173
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# drizzle-kit only:
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_DATABASE_ID=...
CLOUDFLARE_D1_TOKEN=...
```

**`src/lib/server/auth.ts`**

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import * as schema from '#lib/server/db/schema';

export function createAuth(env: Env) {
	const db = drizzle(env.DB, { schema });
	return betterAuth({
		database: drizzleAdapter(db, { provider: 'sqlite', schema }),
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET
			}
		},
		plugins: [sveltekitCookies(getRequestEvent)] // must be last
	});
}
```

**`src/hooks.server.ts`**

```ts
import { env } from 'cloudflare:workers';
import { createAuth } from '#lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
	const auth = createAuth(env);
	event.locals.auth = auth;

	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
```

**Google Console:** redirect URI `http://localhost:5173/api/auth/callback/google` (exact match, `http`, no trailing slash). In Testing mode, add your account under Test users.

## Schema and migration workflow

1. Change `auth.cli.ts` only if you add schema-affecting plugins, then run:
   `npx auth generate --config src/lib/server/auth.cli.ts --output src/lib/server/db/auth.schema.ts`
2. `schema.ts` re-exports the generated tables (`export * from './auth.schema'`).
3. `npx drizzle-kit generate`.
4. Apply with **one tool only** (wrangler `migrations apply` or `drizzle-kit migrate`). Mixing them caused drift, which is why wrangler listed all 5 migrations as pending on a remote DB that already had the tables.
5. Conventions for own tables: `id` via `$defaultFn(() => crypto.randomUUID())`, integer ms timestamps with SQL defaults, boolean as `integer({ mode: 'boolean' })`.

## Open items and before-production checklist

- **Migration drift:** remote has the tables, but wrangler's `d1_migrations` doesn't know about them. Fix by creating a fresh D1 DB for production, or by inserting the migration names into `d1_migrations`.
- **Local vs remote dev DB:** preview showed `env.DB ... remote`. Decide deliberately which one dev uses. Dev logins create rows in whatever DB it points at.
- **Production env:** `wrangler secret put BETTER_AUTH_SECRET` (a different secret from dev), `BETTER_AUTH_URL=https://yourdomain.com`, Google secrets, and add the `https://` production redirect URI in Google Console.
- Add `trustedOrigins` with the production domain.
- Add `prompt: 'select_account'` to the Google provider if you want the account chooser every time.
- Guard `+server.ts` endpoints and form actions separately, since the `/user` layout guard doesn't cover them, and always scope queries by `locals.user.id`.
- Consider moving the Google OAuth consent screen out of Testing mode when real users arrive.
- Lock the dev port in `vite.config.ts`: `server: { port: 5173, strictPort: true }`.
- `$app/env` vs `$app/environment`, and the tsconfig `types` array: both worked in the build, so they were left alone. Verify against the SvelteKit 3 docs which is canonical.

## A note on reliability

SvelteKit 3 and adapter-cloudflare 8 changed several things that older snippets assume (`$lib`, `platform.env`, tsconfig). When docs and the actual error output disagree, trust the error output and the current docs for your versions.

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
