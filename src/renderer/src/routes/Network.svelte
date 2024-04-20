<script lang="ts">
	import NetworkRequestRow from '$lib/components/NetworkRequestRow.svelte';
	import { networkRequests } from '$lib/stores/devTools';
	import { onMount } from 'svelte';

	onMount(async () => {
		networkRequests.load();
	});
</script>

<div class="root">
	<div class="list">
		{#each $networkRequests as row (row.id)}
			<NetworkRequestRow networkRequest={row} />
		{/each}
	</div>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.list {
		overflow-y: auto;
		flex: 1;
	}
</style>
