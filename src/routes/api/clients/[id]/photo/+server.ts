import { getDb } from '#lib/server/db/index.ts';
import { error } from '@sveltejs/kit';
import { env } from 'cloudflare:workers';
import type { RequestHandler } from './$types';
import * as s from '#lib/server/db/schema.ts';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) error(401, 'unauthorize');

	const db = getDb(env.DB);
	const [client] = await db
		.select({ photoKey: s.client.photoKey, photoDtype: s.client.photoDtype })
		.from(s.client)
		.where(and(eq(s.client.id, params.id), eq(s.client.userId, locals.user.id)));

	if (!client?.photoKey) error(404, 'no photo');

	const object = await env.BUCKET.get(client.photoKey);
	if (!object) error(404, 'photo not found');

	return new Response(object.body as unknown as BodyInit, {
		headers: {
			'content-type': client.photoDtype ?? 'application/octet-stream',
			'cache-control': 'private, max-age=3600',
			etag: object.httpEtag
		}
	});
};
