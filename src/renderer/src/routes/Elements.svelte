<script lang="ts">
	import { elements } from '$lib/stores/devTools';
	import Code from '$lib/ui-components/Code.svelte';
	import InlineInput from '$lib/ui-components/form/InlineInput.svelte';
	import Input from '$lib/ui-components/form/Input.svelte';
	import { delay } from '$shared/utils/delay';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let htmlContent: string = '';
	let htmlContainer: HTMLElement;
	let activeElementIndex: number | null = null;
	let elementStyles: Record<string, string> | null = null;
	let styleQuery: string = '';

	$: $elements && parseHtml();

	async function handleElementClick(index: number) {
		try {
			elementStyles = await window.api
				.getElementStyles(index)
				.then((styles) => styles.styles);

			// Remove active state from previous element
			if (activeElementIndex !== null) {
				const previous = getEditableElementAtIndex(activeElementIndex);
				previous?.classList.remove('active-element');
			}

			const nextElement = getEditableElementAtIndex(index);
			nextElement?.classList.add('active-element');

			activeElementIndex = index;
		} catch (err) {
			console.error('error getting styles', err);
		}
	}

	function getEditableElements(): HTMLElement[] {
		return Array.from(htmlContainer.querySelectorAll('.hljs-tag'))
			.filter((element) => !element.textContent?.startsWith('</'))
			.map((ele) => ele.querySelector('.hljs-name') as HTMLElement);
	}

	function getEditableElementAtIndex(index: number): HTMLElement | null {
		return getEditableElements()[index] || null;
	}

	async function parseHtml() {
		htmlContent = hljs.highlight($elements, {
			language: 'html'
		}).value;

		// Make sure the html is rendered before trying to attach event listeners
		await delay(100);
		if (!htmlContainer) return;

		Array.from(htmlContainer.querySelectorAll('.hljs-tag'))
			.filter((element) => !element.textContent?.startsWith('</'))
			.forEach((ele, i) => {
				const tag = ele.querySelector('.hljs-name');
				i === activeElementIndex && tag?.classList.add('active-element');
				tag?.addEventListener('click', () => handleElementClick(i));
			});
	}

	onMount(() => {
		elements.refresh();
	});

	function search(ev: Event) {
		styleQuery = (ev.target as HTMLInputElement).value;
	}

	async function updateStyle(ev: KeyboardEvent, property: string) {
		if (ev.key !== 'Enter' || activeElementIndex === null) return;

		await window.api.setElementStyles(activeElementIndex, {
			[property]: (ev.target as HTMLInputElement).value
		});

		elements.refresh();
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
				{#each Object.entries(elementStyles).filter( (a) => (styleQuery ? a[0].includes(styleQuery) : true) ) as style (style[0])}
					<div class="style-row">
						<div class="name">{`${style[0]}:`}</div>
						<InlineInput
							value={style[1]}
							on:keydown={(ev) => updateStyle(ev, style[0])}
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

	:global(.hljs-name:hover) {
		cursor: pointer;
		border-bottom: 2px solid var(--accent-primary);
	}
	:global(.active-element) {
		border-bottom: 2px solid var(--accent-primary);
	}
</style>
