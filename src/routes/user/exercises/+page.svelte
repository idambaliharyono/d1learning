<script lang="ts">
	import { Skeleton } from '#lib/components/ui/skeleton/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';
	import type { PageProps } from './$types';
	import { youtuEmbedUrl } from '#lib/youtubeUrl.ts';
	import * as Dialog from '#lib/components/ui/dialog/index.ts';
	import { Input } from '#lib/components/ui/input/index.ts';
	import { Plus, SearchIcon } from '@lucide/svelte';
	import Fuse from 'fuse.js';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();
	type Exercise = Awaited<PageProps['data']['exercisesWithAuthor']>[number];
	let exercises = $state.raw<Exercise[] | null>(null);

	$effect(() => {
		exercises = null;
		let stale = false;
		const p = data.exercisesWithAuthor;
		p.then((list) => {
			if (!stale) exercises = list;
		});
		return () => (stale = true);
	});

	// search
	let q = $state('');
	const fuse = $derived(
		new Fuse(exercises ?? [], {
			keys: ['name'],
			threshold: 0.2,
			ignoreLocation: true
		})
	);

	const shown = $derived.by(() => {
		const term = q.trim();
		if (!term) return exercises ?? [];
		return fuse.search(term).map((r) => r.item);
	});
	// search

	let open = $state(false);
	let selected = $state<Exercise | null>(null);
	let urlOverides = $state<Record<string, string>>({});

	function show(e: Exercise) {
		selected = e;
		open = true;
	}

	const currentUrl = $derived(selected ? (urlOverides[selected.id] ?? selected.url) : null);
	const embed = $derived(youtuEmbedUrl(currentUrl));
	const steps = $derived(selected?.instructions);

	// filter
	const LETTERS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
	const letterOf = (name: string) => {
		const c = name.trim().charAt(0).toUpperCase();
		return /[A-Z]/.test(c) ? c : '#';
	};
	const groups = $derived.by(() => {
		const g: Record<string, Exercise[]> = {};
		for (const e of shown) (g[letterOf(e.name)] ??= []).push(e);
		return g;
	});
	function jump(letter: string) {
		document.getElementById(`letter-${letter}`)?.scrollIntoView({ block: 'start' });
	}

	function scrub(e: PointerEvent) {
		const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
		const letter = el?.dataset.letter;
		if (letter && groups[letter]) jump(letter);
	}
</script>

<div class="mx-auto mb-2 flex justify-between px-2">
	<div class="relative w-3/4">
		<SearchIcon
			class="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm text-muted-foreground"
		/>
		<Input type="search" placeholder="Search Exercise..." bind:value={q} class="w-3/4 pl-9"></Input>
	</div>
	<div>
		<Plus></Plus>
	</div>
</div>
{#if exercises === null}
	<div class="flex flex-col gap-5">
		{#each Array(20)}
			<Skeleton class="h-4 w-full"></Skeleton>
		{/each}
	</div>
{:else}
	<nav
		class="leading none fixed top-1/2 right-1 z-20 flex -translate-y-1/2 touch-none flex-col items-center text-xs leading-none select-none"
		onpointerdown={scrub}
		onpointermove={(e) => e.buttons && scrub(e)}
	>
		{#each LETTERS as letter (letter)}
			<button
				type="button"
				data-letter={letter}
				disabled={!groups[letter]}
				class="px-1.5 py-[3px] font-medium text-primary disabled:text-muted-foreground/40"
			>
				{letter}
			</button>
		{/each}
	</nav>
	<div class="pr-6 pl-1">
		{#each LETTERS as letter (letter)}
			{#if groups[letter]}
				<section id="letter-{letter}" class="scroll -mt-0.5">
					<h2 class="text-lg font-bold">{letter}</h2>
					<ul class="w-full">
						{#each groups[letter] as e (e.id)}
							<li>
								<button class="w-full text-left" onclick={() => show(e)}>
									{e.name}
								</button>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		{/each}
	</div>
{/if}

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
			{#if currentUrl}
				<iframe src={embed} title={selected?.name} class="aspect-video w-full"> </iframe>
			{:else}
				<form
					method="POST"
					action="?/setVideo"
					use:enhance={({ formData }) => {
						console.log('sending:', Object.fromEntries(formData));
						const url = String(formData.get('url') ?? '').trim();
						return async ({ result, update }) => {
							if (result.type === 'success' && selected) {
								urlOverides[selected.id] = url;
							}
							await update({ refreshAll: false });
						};
					}}
				>
					<input type="hidden" name="id" value={selected?.id} />
					<div class="mb-2">No video yet!</div>
					<div class="relative w-full">
						<Input type="url" name="url" placeholder="Youtube Url..." />
						<Button type="submit" class="absolute top-1/2 right-0 -translate-y-1/2">
							<Plus />
						</Button>
					</div>
					{#if form?.error}
						<p>{form.error}</p>
					{/if}
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
