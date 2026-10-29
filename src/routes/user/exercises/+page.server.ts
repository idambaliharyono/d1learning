import { redirect, fail } from '@sveltejs/kit';
import { getDb } from '#lib/server/db/index.ts';
import type { Actions, PageServerLoad } from './$types';
import { env } from 'cloudflare:workers';
import * as s from '#lib/server/db/schema.ts';
import { asc, eq } from 'drizzle-orm';
import { youtuEmbedUrl } from '#lib/youtubeUrl.ts';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const db = getDb(env.DB);

	const exercisesWithAuthor = (async () =>
		await db
			.select({
				id: s.exercise.id,
				name: s.exercise.name,
				author: s.user.name,
				url: s.exercise.youtubeUrl,
				instructions: s.exercise.instructions,
				createdAt: s.exercise.createdAt,
				editedAt: s.exercise.updatedAt
			})
			.from(s.exercise)
			.leftJoin(s.user, eq(s.exercise.userId, s.user.id))
			.orderBy(asc(s.exercise.name)))();

	return { exercisesWithAuthor };
};

export const actions: Actions = {
	setVideo: async ({ request, locals }) => {
		if (!locals.user) redirect(303, '/login');
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const url = String(form.get('url') ?? '').trim();

		if (!youtuEmbedUrl(url)) {
			return fail(400, { error: 'not a valid youtube url' });
		}

		const db = getDb(env.DB);
		await db.update(s.exercise).set({ youtubeUrl: url }).where(eq(s.exercise.id, id));

		return { success: true };
	}
};
