import { env } from 'cloudflare:workers';
import { createAuth } from '#lib/server/auth.ts';
import type { Handle } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/env';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(event.request.method, event.url.pathname);
	const auth = createAuth(env);
	event.locals.auth = auth;

	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
