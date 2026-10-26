import { sqliteView } from 'drizzle-orm/sqlite-core';
import { exercise } from './exercise';
import { user } from '../auth.schema';
import { eq } from 'drizzle-orm';

export const exerciseWithAuthor = sqliteView('exercise_with_author').as((qb) =>
	qb.select().from(exercise).leftJoin(user, eq(user.id, exercise.userId))
);
