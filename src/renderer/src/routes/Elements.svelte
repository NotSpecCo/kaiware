<script lang="ts">
	import { elements } from '$lib/stores/devTools';
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
	<pre class="code"><code>{@html htmlContent}</code></pre>
</div>

<style>
	.root {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.code {
		font-size: 1.2rem;
		overflow: auto;
	}
</style>
