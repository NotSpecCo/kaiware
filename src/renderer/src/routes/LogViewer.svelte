<script lang="ts">
	import LogRow from '$lib/components/LogRow.svelte';
	import { logs } from '$lib/stores/logs';
</script>

<div class="root">
	<!-- <div class="header">logs</div> -->
	<div class="list">
		{#each $logs as row (row.id)}
			<LogRow logItem={row} />
		{/each}
	</div>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.header {
		/* height: 100px; */
	}
	.list {
		overflow-y: auto;
		flex: 1;
	}
</style>
