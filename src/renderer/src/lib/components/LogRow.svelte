<script lang="ts">
	import type { Log } from '@nothing-special/kaiware-lib/types';
	import dayjs from 'dayjs';

	export let logItem: Log;

	const displayDate = dayjs(logItem.timestamp).format('LTS');
	const label = `${logItem.source} @ ${displayDate}`;
	let expanded = false;
</script>

<div
	class="root"
	role="button"
	tabindex="0"
	on:click={() => (expanded = !expanded)}
	on:keydown={() => (expanded = !expanded)}
>
	<div
		class="level-bar"
		class:info={logItem.level === 'info' || logItem.level === 'debug'}
		class:warn={logItem.level === 'warn'}
		class:error={logItem.level === 'error'}
	></div>
	<div class="content">
		<div class="metadata">
			<span>{label}</span>
		</div>
		<div class="preview" class:expanded>
			{#each logItem.data as data}
				<span class="item">{typeof data === 'object' ? JSON.stringify(data) : data}</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.root {
		padding: 5px 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		position: relative;
		display: flex;
		font-size: 1.2rem;
	}
	.root:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.level-bar {
		width: 4px;
		position: absolute;
		top: 5px;
		left: 0;
		bottom: 5px;
		border-radius: 2px;
	}
	.level-bar.info {
		background-color: var(--text-tertiary);
	}
	.level-bar.warn {
		background-color: var(--text-warning);
	}
	.level-bar.error {
		background-color: var(--text-error);
	}

	.content {
		flex: 1;
		margin-left: 2px;
	}

	.metadata {
		display: flex;
		color: var(--text-tertiary);
	}

	.preview {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-family: monospace;
	}
	.preview.expanded {
		white-space: pre-wrap;
	}

	.item {
		padding-right: 10px;
	}
	.item:last-of-type {
		padding-right: 0px;
	}
</style>
