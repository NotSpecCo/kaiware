<script lang="ts">
	import { elements } from '$lib/stores/devTools';
	import Code from '$lib/ui-components/Code.svelte';
	import InlineInput from '$lib/ui-components/form/InlineInput.svelte';
	import Input from '$lib/ui-components/form/Input.svelte';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let htmlContent: string = '';
	let htmlContainer: HTMLElement;
	let elementStyles: Record<string, string> | null = null;
	let styleQuery: string = '';

	$: {
		htmlContent = hljs.highlight($elements, {
			language: 'html'
		}).value;

		// Make sure the html is rendered before trying to attach event listeners
		setTimeout(attachListeners, 100);
	}

	async function handleElementClick(index: number) {
		window.api
			.getElementStyles(index)
			.then((styles) => {
				elementStyles = styles.styles;
			})
			.catch((err) => {
				console.error('error getting styles', err);
			});
	}

	function attachListeners() {
		if (!htmlContainer) return;

		Array.from(htmlContainer.querySelectorAll('.hljs-tag'))
			.filter((element) => !element.textContent?.startsWith('</'))
			.forEach((ele, i) => {
				ele.querySelector('.hljs-name')?.addEventListener('click', () =>
					handleElementClick(i)
				);
			});
	}

	onMount(() => {
		elements.refresh();
	});

	function search(ev: Event) {
		styleQuery = (ev.target as HTMLInputElement).value;
	}

	function updateStyle(ev: KeyboardEvent, index: number, property: string) {
		if (ev.key !== 'Enter') return;

		const value = (ev.target as HTMLInputElement).value;
		console.log('updateStyle', index, property, value);
	}
</script>

<div class="root">
	<div class="container" bind:this={htmlContainer}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags-->
		<Code>{@html htmlContent}</Code>
	</div>
	{#if elementStyles}
		<div class="styles-container">
			<div class="header">
				<div class="title">Computed Styles</div>
				<Input placeholder="Search" value={styleQuery} width="120px" on:input={search} />
			</div>
			<!-- TODO: In addition to styles, get element info eg console.dir(element) -->
			<div class="styles">
				{#each Object.entries(elementStyles).filter( (a) => (styleQuery ? a[0].includes(styleQuery) : true) ) as style, i (style[0])}
					<div class="style-row">
						<div class="name">{`${style[0]}:`}</div>
						<!-- <div class="value">{style[1]}</div> -->
						<InlineInput
							value={style[1]}
							on:keydown={(ev) => updateStyle(ev, i, style[0])}
						/>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.root {
		height: 100%;
		display: flex;
	}
	.container {
		flex: 1;
	}

	.styles-container {
		margin-left: 20px;
		background-color: var(--background-dark);
		display: flex;
		flex-direction: column;
		border-radius: 6px;
	}

	.styles-container > .header {
		font-size: 1.6rem;
		font-weight: 600;
		color: var(--text-primary);
		padding: 10px 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.styles-container > .header > .title {
		margin-right: 10px;
	}

	.styles {
		flex: 1;
		overflow-y: auto;
		padding: 0px 15px 10px 15px;
		background-color: var(--background-dark);
	}

	.style-row {
		display: flex;
		flex-direction: column;
		width: 300px;
		font-family: monospace;
		font-size: 1.2rem;
		padding: 5px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
	}
	.style-row:last-of-type {
		border-bottom: none;
	}

	.name {
		color: var(--text-secondary);
		margin-right: 10px;
		margin-bottom: 2px;
	}
	/* .value {
		color: var(--accent-primary);
		white-space: wrap;
	} */
</style>
