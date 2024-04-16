<script lang="ts">
	import { localStorage, sessionStorage } from '$/lib/stores/devTools';
	import Code from '$lib/ui-components/Code.svelte';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let localHtmlContent: string = '';
	let sessionHtmlContent: string = '';

	$: {
		localHtmlContent = hljs.highlight(JSON.stringify($localStorage?.data ?? ''), {
			language: 'json'
		}).value;

		sessionHtmlContent = hljs.highlight(JSON.stringify($sessionStorage?.data ?? ''), {
			language: 'json'
		}).value;
	}

	onMount(() => {
		console.log('Storage page mounted');
		localStorage.refresh();
		sessionStorage.refresh();
	});
</script>

<div class="root">
	<div class="storage-name">Local Storage</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags-->
	<Code>{@html localHtmlContent}</Code>
	<div class="storage-name">Session Storage</div>
	<!-- eslint-disable-next-line svelte/no-at-html-tags-->
	<Code>{@html sessionHtmlContent}</Code>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.storage-name {
		font-size: 1.4rem;
		font-weight: 600;
		margin-bottom: 5px;
	}
</style>
