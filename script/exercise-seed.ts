import { readFileSync } from 'node:fs';
import * as s from '#lib/server/db/schema.ts';
import { getDb } from '#lib/server/db/index.ts';
import type { D1Database } from '@cloudflare/workers-types';
import { getPlatformProxy } from 'wrangler';
import { eq } from 'drizzle-orm';

type RawExercise = {
	id: string;
	name: string;
	instructions: string[];
};

const { env, dispose } = await getPlatformProxy({ remoteBindings: false });
const db = getDb(env.DB as D1Database);

const [me] = await db
	.select({ id: s.user.id })
	.from(s.user)
	.where(eq(s.user.email, 'idambaliharyono02@gmail.com'));
if (!me) throw new Error('login first');

const idamId = me.id;
const raw: RawExercise[] = JSON.parse(readFileSync('script/exercises.json', 'utf-8'));
const rows = raw.map((e) => ({
	userId: idamId,
	name: e.name,
	instructions: e.instructions,
	id: e.id
}));

await db.batch([
	db.delete(s.sessionSets),
	db.delete(s.sessionExercise),
	db.delete(s.workoutSession),
	db.delete(s.routineExercise),
	db.delete(s.routine),
	db.delete(s.exercise)
]);
const COLS = 4;
const CHUNK = Math.floor(100 / COLS) - 1;
let inserted = 0;

for (let i = 0; i < rows.length; i += CHUNK) {
	const chunk = rows.slice(i, i + CHUNK);
	await db.insert(s.exercise).values(chunk).onConflictDoNothing();
	inserted += chunk.length;
}

console.log(`Processed ${inserted} of ${rows.length} exercise`);
await dispose();
