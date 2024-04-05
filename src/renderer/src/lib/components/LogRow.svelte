<script lang="ts">
	import dayjs from 'dayjs';
	import type { LogItem } from 'src/types/LogItem';
	export let logItem: LogItem;

	const displayDate = dayjs(logItem.timestamp).format('LTS');
	const label = `${logItem.source} @ ${displayDate}`;
	let expanded = false;
</script>

<div
	class="root"
	class:info={logItem.level === 'info'}
	class:warn={logItem.level === 'warn'}
	class:error={logItem.level === 'error'}
	role="button"
	tabindex="0"
	on:click={() => (expanded = !expanded)}
	on:keydown={() => (expanded = !expanded)}
>
	<div class="metadata">
		<span>{label}</span>
	</div>
	<div class="preview" class:expanded>
		{logItem.data}
	</div>
</div>

<style>
	.root {
		padding: 5px 10px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		border-left: 4px solid transparent;
		cursor: pointer;
	}
	.root:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.root.warn {
		border-left-color: var(--text-warning);
	}
	.root.error {
		border-left-color: var(--text-error);
	}

	.metadata {
		display: flex;
		font-size: 1.2rem;
		color: var(--text-secondary);
	}

	.preview {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-family: monospace;
		font-size: 1.4rem;
	}
	.preview.expanded {
		white-space: pre-wrap;
	}
</style>
