import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDb } from '#lib/server/db/index.ts';
import { env } from 'cloudflare:workers';
import * as s from '#lib/server/db/schema.ts';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const db = getDb(env.DB);

	const exercisesWithAuthor = (async () =>
		db.select().from(s.exerciseWithAuthor).orderBy(asc(s.exerciseWithAuthor.name)))();

	return { exercisesWithAuthor };
};
