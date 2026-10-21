import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ locals, request }) => {
		await locals.auth.api.signOut({ headers: request.headers });
		redirect(303, '/login');
	}
};
