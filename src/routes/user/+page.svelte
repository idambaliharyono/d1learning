<script lang="ts">
	let { data } = $props();
</script>

<h1>hello {data.user.name}</h1>
<form method="POST" action="/logout">
	<button>logout</button>
</form>
