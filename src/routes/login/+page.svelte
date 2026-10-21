<script lang="ts">
	import { authClient } from '#lib/auth-client.ts';

	let loading = $state(false);
	async function signInWithGoogle() {
		loading = true;
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/user',
			errorCallbackURL: '/login?error=auth'
		});
		loading = false;
	}
</script>

<main>
	<h1>sign In</h1>
	<button onclick={signInWithGoogle} disabled={loading}>
		{loading ? 'Redirecting' : 'Sign In With Google'}
	</button>
</main>
