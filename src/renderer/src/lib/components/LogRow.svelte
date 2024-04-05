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
		<div>{label}</div>
		<!-- <div class="source">{logItem.source}</div>
		<div class="level">{logItem.level}</div>
		<div class="time">@ {displayDate}</div>
		<div class="flex"></div> -->
	</div>
	<div class="preview" class:expanded>
		{logItem.data}
	</div>
</div>

<style>
	.root {
		padding: 5px 10px;
		/* margin-bottom: 5px; */
		border-bottom: 1px solid #ddd;
		border-left: 4px solid transparent;
		cursor: pointer;
	}
	.root:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.root.info {
		/* border-left-color: var(--text-secondary); */
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
	}

	.source {
		color: #555;
	}
	.root.error .level {
		color: var(--text-error);
	}
	.root.warn .level {
		color: var(--text-warning);
	}

	.flex {
		flex: 1;
	}

	.time {
		color: #666;
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
