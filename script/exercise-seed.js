import { readFileSync } from 'node:fs';
import { exercise } from '../src/lib/server/db/tables/exercise.ts';
import { getDb } from '#lib/server/db/index.ts';
import { getPlatformProxy } from 'wrangler';
const idamId = 'gGMYeUuvbJVyEvqFHNxJ5GwErbCUZjsz';
const { env, dispose } = await getPlatformProxy({ remoteBindings: false });
const db = getDb(env.DB);
const raw = JSON.parse(readFileSync('script/exercise.json', 'utf-8'));
const rows = raw.map((e) => ({
    userId: idamId,
    name: e.name,
    note: e.instruction,
    id: e.id
}));
const CHUNK = 50;
let inserted = 0;
for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await db.insert(exercise).values(chunk).onConflictDoNothing();
    inserted += chunk.length;
}
console.log(`Processed ${inserted} of ${rows.length} exercise`);
await dispose();
