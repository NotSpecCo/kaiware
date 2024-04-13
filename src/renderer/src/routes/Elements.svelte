<script lang="ts">
	import { elements } from '$lib/stores/devTools';
	import Code from '$lib/ui-components/Code.svelte';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let htmlContent: string = '';

	$: {
		htmlContent = hljs.highlight($elements, {
			language: 'html'
		}).value;
	}

	onMount(async () => {
		elements.load();
	});
</script>

<div class="root">
	<!-- eslint-disable-next-line svelte/no-at-html-tags-->
	<Code>{@html htmlContent}</Code>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
