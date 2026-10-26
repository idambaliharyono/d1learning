<script lang="ts">
	let { children } = $props();
</script>

<div class="max-w-sm">
	<div>header</div>

	{@render children()}
	<div>footer</div>
</div>
