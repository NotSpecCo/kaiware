<script lang="ts">
	import { formatBytes } from '$shared/utils/formatBytes';
	import type { NetworkRequest } from '@nothing-special/kaiware-lib/types';
	import dayjs from 'dayjs';

	export let networkRequest: NetworkRequest;

	const displayDate = dayjs(networkRequest.startTime).format('LTS');
</script>

<div class="network-request-row" on:click on:keydown role="link" tabindex="0">
	<div class="date">{displayDate}</div>
	<div class="method">{networkRequest.method}</div>
	<div class="url">{networkRequest.url}</div>
	<div class="size">{formatBytes(networkRequest.responseSize)}</div>
	{#if networkRequest.duration}
		<div class="duration">{`${networkRequest.duration} ms`}</div>
	{/if}
	<div
		class="status"
		class:success={networkRequest.lifecycleStatus === 'success'}
		class:error={networkRequest.lifecycleStatus === 'error' ||
			networkRequest.lifecycleStatus === 'aborted' ||
			networkRequest.lifecycleStatus === 'timeout'}
	>
		{networkRequest.lifecycleStatus}
	</div>
	<div
		class="status-code"
		class:success={networkRequest.responseStatus &&
			networkRequest.responseStatus >= 200 &&
			networkRequest.responseStatus < 300}
		class:warning={networkRequest.responseStatus &&
			networkRequest.responseStatus >= 300 &&
			networkRequest.responseStatus < 400}
		class:error={networkRequest.responseStatus && networkRequest.responseStatus >= 400}
	>
		{networkRequest.responseStatus}
	</div>
</div>

<style>
	.network-request-row {
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 7px 0;
		cursor: pointer;
	}
	.network-request-row:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	div.success {
		color: var(--success-color);
	}
	div.warning {
		color: var(--warning-color);
	}
	div.error {
		color: var(--error-color);
	}

	.network-request-row > div {
		margin-right: 10px;
	}
	.network-request-row > div:last-of-type {
		margin-right: 0px;
	}

	.method {
		color: var(--accent-color);
	}

	.url {
		flex: 1;
	}

	.size,
	.duration {
		color: var(--secondary-text-color);
	}
</style>
