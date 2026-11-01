<script lang="ts">
	import Skeleton from '#lib/components/ui/skeleton/skeleton.svelte';

	let { data } = $props();
</script>

{#await data.clients}
	{#each Array(20)}
		<Skeleton class="h-4 w-full"></Skeleton>
	{/each}
{:then clients}
	<ul>
		{#each clients as client (client)}
			<li>{client.name}</li>
		{/each}
	</ul>
{/await}
