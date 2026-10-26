import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: './.dev.vars', override: true });

if (!process.env.CLOUDFLARE_ACCOUNT_ID) throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
if (!process.env.CLOUDFLARE_DATABASE_ID) throw new Error('CLOUDFLARE_DATABASE_ID is not set');
if (!process.env.CLOUDFLARE_D1_TOKEN) throw new Error('CLOUDFLARE_D1_TOKEN is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	dialect: 'sqlite',
	out: './drizzle',
	dbCredentials: {
		url: 'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/d9f2ce37bc4302f0a48f79b22a7dc6e3247fcaf322cab70bd30c26c99fe2ea23.sqlite'
	},
	verbose: true,
	strict: true
});
