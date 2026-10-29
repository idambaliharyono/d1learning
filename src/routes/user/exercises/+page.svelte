<script lang="ts">
	import { Skeleton } from '#lib/components/ui/skeleton/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	import type { PageProps } from './$types';
	import { youtuEmbedUrl } from '#lib/youtubeUrl.ts';
	import * as Dialog from '#lib/components/ui/dialog/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();
	type Exercise = Awaited<PageProps['data']['exercisesWithAuthor']>[number];
	let q = $state('');

	let open = $state(false);
	let selected = $state<Exercise | null>(null);

	function show(e: Exercise) {
		selected = e;
		open = true;
	}
	const embed = $derived(youtuEmbedUrl(selected?.url));
	const steps = $derived(selected?.instructions);
</script>

<div class="flex justify-between">
	<div class="relative mx-auto w-3/4">
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm text-muted-foreground"
		/>
		<Input type="search" placeholder="Search Exercise..." bind:value={q} class="w-3/4 pl-9"></Input>
	</div>
	<div>
		<Plus></Plus>
	</div>
</div>
{#await data.exercisesWithAuthor}
	<div class="flex flex-col gap-5">
		{#each Array(20)}
			<Skeleton class="h-4 w-full"></Skeleton>
		{/each}
	</div>
{:then exercises}
	{@const shown = exercises.filter((e: Exercise) =>
		e.name.toLowerCase().includes(q.trim().toLowerCase())
	)}
	<ul class="w-full">
		{#each shown as e (e.id)}
			<li class="text-left">
				<button class="w-full" onclick={() => show(e)}>
					{e.name}
				</button>
			</li>
		{/each}
	</ul>
{/await}

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Title>
			<div class="flex flex-col">
				<div>
					{selected?.name}
				</div>
				<div class="text-xs font-extralight">
					added by:{selected?.author}
				</div>
			</div>
		</Dialog.Title>
		<div class="w-full">
			{#if selected?.url}
				<iframe src={embed} title={selected?.name} class="aspect-video w-full"> </iframe>
			{:else}
				<form
					method="POST"
					use:enhance={() =>
						async ({ update }) => {
							await update();
						}}
				>
					<Input type="url" placeholder="paste related youtube video url here!" />

					{#if form?.error}<p>{form.error}</p>{/if}
					<Button type="submit">
						<Plus />
					</Button>
				</form>
			{/if}
		</div>
		<Dialog.Header>
			<div>instructions:</div>
			<ol class="list-decimal pl-2 text-justify">
				{#each steps as step, i (i)}
					<li class="mb-1">{step}</li>
				{/each}
			</ol>
		</Dialog.Header>
		<Dialog.Description></Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
