<script lang="ts">
	import NetworkRequestDetail from '$lib/components/NetworkRequestDetail.svelte';
	import NetworkRequestRow from '$lib/components/NetworkRequestRow.svelte';
	import { networkRequests } from '$lib/stores/devTools';
	import { onMount } from 'svelte';

	let selectedNetworkRequestId: number | null = null;

	onMount(async () => {
		networkRequests.load();
	});

	function handleRowClick(requestId: number) {
		console.log('Row clicked', requestId);
		// selectedNetworkRequestId = requestId;
	}
</script>

<div class="root">
	<div class="list">
		{#each $networkRequests as row (row.id)}
			<NetworkRequestRow networkRequest={row} on:click={() => handleRowClick(row.id)} />
		{/each}
	</div>
	{#if selectedNetworkRequestId !== null}
		<NetworkRequestDetail
			networkRequestId={selectedNetworkRequestId}
			on:close={() => (selectedNetworkRequestId = null)}
		/>
	{/if}
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
