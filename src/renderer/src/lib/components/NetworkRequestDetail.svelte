<script lang="ts">
	import { formatBytes } from '$shared/utils/formatBytes';
	import type { NetworkRequest } from '@nothing-special/kaiware-lib/types';
	import dayjs from 'dayjs';
	import { createEventDispatcher } from 'svelte';

	export let networkRequestId: number;

	$: console.log('Network request id', networkRequestId);

	let request: NetworkRequest | null = null;

	const dispatch = createEventDispatcher();

	$: window.api
		.getNetworkRequestById(networkRequestId)
		.then((res) => {
			console.log('Network request by id', res);
			request = res;
		})
		.catch((err) => {
			console.error('Error getting network request by id', err);
		});

	window.api.onNetworkRequestUpdate((newRequest) => {
		if (newRequest.id === networkRequestId) {
			console.log('Network request updated', newRequest);
			request = newRequest;
		}
	});

	function close() {
		dispatch('close');
	}
</script>

<div class="network-request-detail">
	<div class="header">
		<button on:click={close}>close</button>
	</div>
	{#if request === null}
		<div class="message">No request.</div>
	{:else}
		<div class="network-request-row" on:click on:keydown role="link" tabindex="0">
			<div class="date">{dayjs(request.startTime).format('LTS')}</div>
			<div class="method">{request.method}</div>
			<div class="url">{request.url}</div>
			<div class="size">{formatBytes(request.responseSize)}</div>
			{#if request.duration}
				<div class="duration">{`${request.duration} ms`}</div>
			{/if}
			<div
				class="status"
				class:success={request.lifecycleStatus === 'success'}
				class:error={request.lifecycleStatus === 'error' ||
					request.lifecycleStatus === 'aborted' ||
					request.lifecycleStatus === 'timeout'}
			>
				{request.lifecycleStatus}
			</div>
			<div
				class="status-code"
				class:success={request.responseStatus &&
					request.responseStatus >= 200 &&
					request.responseStatus < 300}
				class:warning={request.responseStatus &&
					request.responseStatus >= 300 &&
					request.responseStatus < 400}
				class:error={request.responseStatus && request.responseStatus >= 400}
			>
				{request.responseStatus}
			</div>
		</div>
	{/if}
</div>

<style>
	.network-request-detail {
		border: 1px solid red;
		flex: 2;
	}
</style>
