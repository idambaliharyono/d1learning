import { timestamps, setTypes } from './shared.ts';
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { user } from '../auth.schema';
import { sql } from 'drizzle-orm';
import { client } from './client.ts';
import { exercise } from './exercise.ts';
// -----------------------------------------------------------------------------------------
//
export const routine = sqliteTable('routine', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clientId: text('client_id')
		.references(() => client.id)
		.notNull(),
	name: text('name').notNull(),
	...timestamps
});

// -----------------------------------------------------------------------------------------
export const routineExercise = sqliteTable('routine_exercise', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	routineId: text('routine_id')
		.notNull()
		.references(() => routine.id),
	exerciseId: text('exercise_id')
		.notNull()
		.references(() => exercise.id),
	position: integer('position').notNull(),
	...timestamps
});

// -----------------------------------------------------------------------------------------
export const routineExerciseSet = sqliteTable('routine_exercise_set', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	routineExerciseId: text('routine_exercise_id')
		.notNull()
		.references(() => routineExercise.id),
	setNumber: integer('set_number').notNull(),
	targetReps: integer('target_reps'),
	targetWeight: real('target_weight'),
	type: text('type', { enum: setTypes }).notNull().default('working'),
	...timestamps
});

// -----------------------------------------------------------------------------------------
export const workoutSession = sqliteTable('workout_session', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	clientId: text('client_id')
		.notNull()
		.references(() => client.id),
	routineId: text('routine_id').references(() => routine.id),
	name: text('name'),
	startedAt: integer('started_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	finishedAt: integer('finished_at', { mode: 'timestamp_ms' }),
	status: text('status', { enum: ['ongoing', 'finished', 'discarded'] })
		.notNull()
		.default('ongoing'),
	note: text('note')
});

// -----------------------------------------------------------------------------------------
export const sessionExercise = sqliteTable('session_exercise', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	sessionId: text('session_id')
		.notNull()
		.references(() => workoutSession.id),
	exerciseId: text('exercise_id')
		.notNull()
		.references(() => exercise.id),
	position: integer('position').notNull(),
	note: text('note')
});

// -----------------------------------------------------------------------------------------

export const sessionSets = sqliteTable('session_sets', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	sessionExerciseId: text('session_exercise_id')
		.notNull()
		.references(() => sessionExercise.id),
	setNumber: integer('set_number').notNull(),
	type: text('type', { enum: setTypes }).notNull().default('working'),
	reps: integer('reps'),
	weight: real('weight'),
	rir: real('rir'),
	rpe: real('rpe'),
	note: text('note')
});
