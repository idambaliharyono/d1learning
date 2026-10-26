import { sqliteView } from 'drizzle-orm/sqlite-core';
import { exercise } from './exercise';
import { user } from '../auth.schema';
import { eq, sql } from 'drizzle-orm';

export const exerciseWithAuthor = sqliteView('exercise_with_author').as((qb) =>
	qb
		.select({
			id: exercise.id,
			name: exercise.name,
			author: sql<string | null>`${user.name}`.as('author'),
			url: exercise.youtubeUrl,
			instruction: exercise.instruction,
			createdAt: exercise.createdAt
		})
		.from(exercise)
		.leftJoin(user, eq(user.id, exercise.userId))
);
export type ExerciseWithAuthor = typeof exerciseWithAuthor.$inferSelect;
