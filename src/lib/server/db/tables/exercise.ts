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
	instruction: text('instruction'),
	youtubeUrl: text('youtube_url'),
	note: text('note'),
	...timestamps
});

export type Exercise = typeof exercise.$inferSelect;
export type newExercise = typeof exercise.$inferInsert;
