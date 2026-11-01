import { getDb } from '#lib/server/db/index.ts';
import { getPlatformProxy } from 'wrangler';
import * as s from '#lib/server/db/schema.ts';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { eq } from 'drizzle-orm';
import { fileURLToPath } from 'url';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const ASSETS = fileURLToPath(new URL('../src/lib/assets/', import.meta.url));
const MIME: Record<string, string> = {
	'.jpg': 'iamge/jpeg',
	'.jpeg': 'iamge/jpeg',
	'.png': 'iamge/png',
	'.webp': 'iamge/webp',
	'.gif': 'iamge/gif'
};
async function clearBucket(bucket: R2Bucket) {
	let cursor: string | undefined;
	let total = 0;

	do {
		const list = await bucket.list({ cursor, limit: 1000 });
		const keys = list.objects.map((o) => o.key);

		if (keys.length) {
			await bucket.delete(keys);
			total += keys.length;
		}
		cursor = list.truncated ? list.cursor : undefined;
	} while (cursor);
	console.log(`cleared ${total} objects from R2`);
}

async function uploadPhoto(
	bucket: R2Bucket,
	clientId: string,
	assetFile: string
): Promise<{ key: string; dtype: string }> {
	const filePath = join(ASSETS, assetFile);
	const buf = await readFile(filePath);
	const ext = extname(assetFile).toLowerCase();
	const dtype = MIME[ext];
	if (!dtype) throw new Error(`unsuported extension: ${assetFile}`);

	const key = `clients/${clientId}/${crypto.randomUUID()}${ext}`;

	await bucket.put(key, buf, {
		httpMetadata: { contentType: dtype }
	});
	return { key, dtype };
}

async function main() {
	const { env, dispose } = await getPlatformProxy({ remoteBindings: false });
	const db = getDb(env.DB as D1Database);
	const bucket = env.BUCKET as R2Bucket;
	const [me] = await db
		.select({ id: s.user.id })
		.from(s.user)
		.where(eq(s.user.email, 'idambaliharyono02@gmail.com'));
	if (!me) throw new Error('login first');

	const coachId = me.id;
	await clearBucket(bucket);

	const id = () => crypto.randomUUID();
	const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

	const budi = id(),
		andi = id();
	const bench = id(),
		squat = id(),
		row = id();
	const oldSession = id(),
		newSession = id();
	// templateSession = id();
	const oldSE = id(),
		newSE = id();
	// templateSE = id();

	const andiPhoto = await uploadPhoto(bucket, andi, 'andi.jpeg');
	const budiPhoto = await uploadPhoto(bucket, budi, 'budi.jpg');
	await db.batch([
		db.delete(s.sessionSets),
		db.delete(s.sessionExercise),
		db.delete(s.workoutSession),
		db.delete(s.routineExercise),
		db.delete(s.routine),
		db.delete(s.clientNote),
		db.delete(s.clientNote),
		db.delete(s.client),
		db.delete(s.exercise),

		db.insert(s.client).values([
			{
				id: andi,
				name: 'Andi',
				userId: coachId,
				photoKey: andiPhoto.key,
				photoDtype: andiPhoto.dtype
			},
			{
				id: budi,
				name: 'Budi',
				userId: coachId,
				photoKey: budiPhoto.key,
				photoDtype: budiPhoto.dtype
			}
		]),

		db.insert(s.exercise).values([
			{
				id: bench,
				name: 'Bench Press',
				userId: coachId,
				youtubeUrl: 'https://www.youtube.com/watch?v=HvOtOk_zqJ4'
			},
			{
				id: squat,
				name: 'Squat',
				userId: coachId,
				youtubeUrl: 'https://youtu.be/XLTyLWgkQd0?si=ujb3S3JeHNDvkw8z'
			},
			{
				id: row,
				name: 'Barbell Row',
				userId: coachId,
				youtubeUrl: 'https://youtu.be/XLTyLWgkQd0?si=ujb3S3JeHNDvkw8z'
			}
		]),

		db.insert(s.workoutSession).values([
			// {
			// 	id: templateSession,
			// 	userId: coachId,
			// 	clientId: budi,
			// 	name: templateA,
			// 	status: 'finished',
			// 	startedAt: daysAgo(8),
			// 	finishedAt: daysAgo(8),
			// 	note: 'good, very good'
			// },
			{
				id: oldSession,
				userId: coachId,
				clientId: budi,
				name: 'unamed evening workout',
				status: 'finished',
				startedAt: daysAgo(7),
				finishedAt: daysAgo(7),
				note: 'lorem ipsum sit amet dolor'
			},
			{
				id: newSession,
				userId: coachId,
				clientId: budi,
				name: 'Morning workout',
				status: 'finished',
				startedAt: daysAgo(2),
				finishedAt: daysAgo(2),
				note: 'memento mori, vini vidi vici'
			}
		]),

		db.insert(s.sessionExercise).values([
			{
				id: oldSE,
				sessionId: oldSession,
				exerciseId: bench,
				position: 1
			},
			{
				id: newSE,
				sessionId: newSession,
				exerciseId: squat,
				position: 1
			}
		]),

		db.insert(s.sessionSets).values([
			{
				id: id(),
				sessionExerciseId: oldSE,
				setNumber: 1,
				type: 'warmup',
				reps: 20,
				weight: 30
			},
			{
				id: id(),
				sessionExerciseId: oldSE,
				setNumber: 2,
				type: 'working',
				reps: 10,
				weight: 50
			},
			{
				id: id(),
				sessionExerciseId: oldSE,
				setNumber: 3,
				type: 'working',
				reps: 10,
				weight: 50
			},
			{
				id: id(),
				sessionExerciseId: oldSE,
				setNumber: 4,
				type: 'working',
				reps: 10,
				weight: 50
			},
			{
				id: id(),
				sessionExerciseId: newSE,
				setNumber: 1,
				type: 'warmup',
				reps: 20,
				weight: 30
			},
			{
				id: id(),
				sessionExerciseId: newSE,
				setNumber: 2,
				type: 'warmup',
				reps: 12,
				weight: 60
			}
		])
	]);

	console.log('seeded');
	await dispose();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
