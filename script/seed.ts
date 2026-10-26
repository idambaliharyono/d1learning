import { getDb } from '#lib/server/db/index.ts';
import { getPlatformProxy } from 'wrangler';
import * as s from '#lib/server/db/schema.ts';
import type { D1Database } from '@cloudflare/workers-types';

async function main() {
	const { env, dispose } = await getPlatformProxy({ remoteBindings: false });
	const db = getDb(env.DB as D1Database);

	const coachId = 'D0PY3ppciBE4DbwIL71GCFJLNqeTuFQd';

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

	await db.batch([
		db.delete(s.sessionSets),
		db.delete(s.sessionExercise),
		db.delete(s.session),
		db.delete(s.routineExercise),
		db.delete(s.routine),
		db.delete(s.clientNote),
		db.delete(s.clientNote),
		db.delete(s.client),
		db.delete(s.exercise),

		db.insert(s.client).values([
			{ id: andi, name: 'Andi', userId: coachId },
			{ id: budi, name: 'Budi', userId: coachId }
		]),

		db.insert(s.exercise).values([
			{ id: bench, name: 'Bench Press', userId: coachId },
			{ id: squat, name: 'Squat', userId: coachId },
			{ id: row, name: 'Barbell Row', userId: coachId }
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
