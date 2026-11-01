<script lang="ts">
	import { page } from '$app/state';
	let { children } = $props();

	let pageName = $derived(page.route.id?.split('/').pop() ?? '');
</script>

<div class="max-w-sm">
	<div class="my-2 w-full text-center text-xl">{pageName.toUpperCase()}</div>

	{@render children()}
	<div>footer</div>
</div>
