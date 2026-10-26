<script lang="ts">
	import { Skeleton } from '#lib/components/ui/skeleton/index.ts';
	import type { ExerciseWithAuthor } from '#lib/server/db/schema.ts';
	import { youtuEmbedUrl } from '#lib/youtubeUrl.ts';
	import * as Dialog from '../../../lib/components/ui/dialog/index.ts';
	let { data } = $props();
	let q = $state('');

	let open = $state(false);
	let selected = $state<ExerciseWithAuthor | null>(null);

	function show(e: ExerciseWithAuthor) {
		selected = e;
		open = true;
	}
	const embed = $derived(youtuEmbedUrl(selected?.url));
</script>

<input bind:value={q} placeholder="Search Exercise" />
{#await data.exercisesWithAuthor}
	<div class="flex flex-col gap-5">
		{#each Array(20)}
			<Skeleton class="h-4 w-full"></Skeleton>
		{/each}
	</div>
{:then exercises}
	{@const shown = exercises.filter((e: ExerciseWithAuthor) =>
		e.name.toLowerCase().includes(q.toLowerCase())
	)}
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
			<span class="text-sm font-extralight">added by: {selected?.author}</span>
		</Dialog.Title>
		<div>
			<iframe src={embed} title={selected?.name} class="aspect-video w-full"> </iframe>
		</div>
		<Dialog.Description>{selected?.instruction}</Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
