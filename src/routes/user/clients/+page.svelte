<script lang="ts">
	import Skeleton from '#lib/components/ui/skeleton/skeleton.svelte';
	import type { PageProps } from './$types.js';
	import * as Dialog from '#lib/components/ui/dialog/index.ts';
	import { Button } from '#lib/components/ui/button/index.ts';

	let { data } = $props();
	type Client = Awaited<PageProps['data']['clients']>[number];

	let openClient = $state(false);
	let selected = $state<Client | null>(null);
	function show(e: Client) {
		selected = e;
		openClient = true;
	}
	let openNewClient = $state(false);
</script>

<div class="flex justify-center">
	<Button onclick={() => (openNewClient = true)}>add a new client (+)</Button>
</div>

{#await data.clients}
	{#each Array(20)}
		<Skeleton class="h-4 w-full"></Skeleton>
	{/each}
{:then clients}
	<ul>
		{#each clients as client (client)}
			{#if client.photoKey}
				<li>
					<button class="flex" type="button" onclick={() => show(client)}>
						<img
							src="/api/clients/{client.id}/photo"
							alt={client.name}
							loading="lazy"
							class="size-10 rounded-full object-cover"
						/>
						<div>{client.name}</div>
					</button>
				</li>
			{:else}
				<li>
					<button>
						<div class="size-10 rounded-full bg-gray-400"></div>
						<div>{client.name}</div>
					</button>
				</li>
			{/if}
		{/each}
	</ul>
{:catch}
	<p>error at loading data</p>
{/await}

<Dialog.Root bind:open={openClient}>
	<Dialog.Content>
		<Dialog.Title>{selected?.name}</Dialog.Title>
		<Dialog.Footer>
			<Button class="mx-auto">Train</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={openNewClient}>
	<Dialog.Content>
		<Dialog.Title>Add new Client</Dialog.Title>
		<Dialog.Footer>
			<Button class="mx-auto">Add</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
