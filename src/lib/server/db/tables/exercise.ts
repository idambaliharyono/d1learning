import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './shared.ts';
import { user } from '../auth.schema.ts';
// -----------------------------------------------------------------------------------------
export const exercise = sqliteTable('exercise', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	youtubeUrl: text('youtube_url'),
	instructions: text('instructions', { mode: 'json' }).$type<string[]>(),
	...timestamps
});

export type Exercise = typeof exercise.$inferSelect;
export type NewExercise = typeof exercise.$inferInsert;

// export const exerciseNote = sqliteTable('exercise_not', {
// 	id: text('id')
// 		.primaryKey()
// 		.$defaultFn(() => crypto.randomUUID()),
// 	exerciseId: text('exercise_id')
// 		.notNull()
// 		.references(() => exercise.id),
// 	content: text('content'),
// 	userid: text('user_id')
// 		.notNull()
// 		.references(() => user.id),
// 	...timestamps
// });
