<script lang="ts">
	import Code from '$lib/ui-components/Code.svelte';
	import Input from '$lib/ui-components/form/Input.svelte';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let command: string = '';
	let localHtmlContent: string = '';

	onMount(async () => {});

	async function search(ev: Event) {
		command = (ev.target as HTMLInputElement).value;
		if ((ev as any).key !== 'Enter' || !command) return;

		(ev.target as HTMLInputElement).value;
		const result = await window.api.executeConsoleCommand(command);
		console.log(result);

		// const code = await formatCode(result.result, 'json');
		localHtmlContent = hljs.highlight(JSON.stringify(result.result, null, 2), {
			language: 'json'
		}).value;
	}
</script>

<div class="root">
	<div class="console">
		<Input placeholder="Search" value={command} width="100%" on:keydown={search} />
	</div>
	<div class="code">
		<!-- eslint-disable-next-line svelte/no-at-html-tags-->
		<Code>{@html localHtmlContent}</Code>
	</div>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: 15px;
	}

	.console {
		margin-bottom: 15px;
	}
	.code {
		padding-bottom: 15px;
	}
</style>
