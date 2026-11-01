import { redirect, fail } from '@sveltejs/kit';
import { getDb } from '#lib/server/db/index.ts';
import type { Actions, PageServerLoad } from './$types';
import { env } from 'cloudflare:workers';
import * as s from '#lib/server/db/schema.ts';
import { asc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/login');
	const userId = locals.user.id;
	const db = getDb(env.DB);

	const clientsPromise = await db
		.select({
			id: s.client.id,
			name: s.client.name,
			createdAt: s.client.createdAt,
			editedAt: s.client.updatedAt
		})
		.from(s.client)
		.where(eq(s.client.userId, userId))
		.orderBy(asc(s.client.name));

	return { clients: clientsPromise };
};

// export const actions: Actions = {
// 	setVideo: async ({ request, locals }) => {
// 		if (!locals.user) redirect(303, '/login');
// 		const form = await request.formData();
// 		const id = String(form.get('id') ?? '');
// 		const url = String(form.get('url') ?? '').trim();
//
// 		if (!youtuEmbedUrl(url)) {
// 			return fail(400, { error: 'not a valid youtube url' });
// 		}
//
// 		const db = getDb(env.DB);
// 		await db.update(s.exercise).set({ youtubeUrl: url }).where(eq(s.exercise.id, id));
//
// 		return { success: true };
// 	}
// }
