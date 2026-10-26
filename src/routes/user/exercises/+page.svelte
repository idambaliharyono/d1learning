<script lang="ts">
	import { Skeleton } from '#lib/components/ui/skeleton/index.ts';
	import type { Exercise } from '#lib/server/db/tables/exercise.ts';
	import * as Dialog from '../../../lib/components/ui/dialog/index.ts';
	let { data } = $props();
	let q = $state('');

	let open = $state(false);
	let selected = $state<Exercise | null>(null);

	function show(e: Exercise) {
		selected = e;
		open = true;
	}
</script>

<input bind:value={q} placeholder="Search Exercise" />
{#await data.exercises}
	<div class="flex flex-col gap-5">
		{#each Array(20)}
			<Skeleton class="h-4 w-full"></Skeleton>
		{/each}
	</div>
{:then exercises}
	{@const shown = exercises.filter((e: Exercise) => e.name.toLowerCase().includes(q.toLowerCase()))}
	<ul>
		{#each shown as e (e.id)}
			<li>
				<button onclick={() => show(e)}>
					{e.name}
				</button>
			</li>
		{/each}
	</ul>
{/await}

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Title
			>{selected?.name}
			<span class="text-sm font-extralight">added by: {selected?.userId}</span>
		</Dialog.Title>
		<div></div>
		<Dialog.Description>{selected?.instruction}</Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
