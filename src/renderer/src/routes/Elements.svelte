<script lang="ts">
	import { elements } from '$lib/stores/devTools';
	import Code from '$lib/ui-components/Code.svelte';
	import InlineInput from '$lib/ui-components/form/InlineInput.svelte';
	import Input from '$lib/ui-components/form/Input.svelte';
	import type { ElementStylesUpdate } from '@nothing-special/kaiware-lib/types';
	import hljs from 'highlight.js';
	import { onMount } from 'svelte';

	let htmlContent: string = '';
	let htmlContainer: HTMLElement;
	let elementStyles: Record<string, string> | null = null;
	let styleQuery: string = '';

	$: {
		console.log('begin highlight');
		htmlContent = hljs.highlight($elements, {
			language: 'html'
		}).value;
		parseHtml();
	}

	// function getXPath(element) {
	// 	let xpath = '';
	// 	for (; element && element.nodeType == 1; element = element.parentNode) {
	// 		let id = Array.prototype.indexOf.call(element.parentNode.childNodes, element) + 1;
	// 		id = id > 1 ? '[' + id + ']' : '';
	// 		xpath = '/' + element.nodeName.toLowerCase() + id + xpath;
	// 	}
	// 	return xpath;
	// }

	async function handleElementClick(index: number) {
		console.log('handleElementClick', index);

		// eslint-disable-next-line no-async-promise-executor
		const result: ElementStylesUpdate = await new Promise(async (resolve) => {
			console.log('get styles', index);

			await window.api.getElementStyles(index);
			window.api.onElementStylesChange((data) => {
				resolve(data);
			});
		});

		console.log('got styles', result);
		elementStyles = result.styles;

		// const docu = new DOMParser().parseFromString(get(elements), 'text/html');
		// // console.log('docu', docu);
		// const docuElements = docu.querySelectorAll('*');
		// console.log('docuElements', docuElements);

		// const path = getXPath(docuElements[index]);
		// console.log('path', path);

		// document.evaluate('/html/body[3]/button[2]', document, null, XPathResult.ANY_TYPE, null);
		// document.evaluate('//button', document, null, XPathResult.ANY_TYPE, null);
	}

	function parseHtml() {
		if (!htmlContainer) return;

		console.log('start parse');
		let allElements = Array.from(htmlContainer.querySelectorAll('.hljs-tag'));
		console.log('allElements', allElements.length);

		allElements = allElements.filter((element) => !element.textContent?.startsWith('</'));
		console.log('allElements2', allElements);

		// let insideHeadElement = false;
		// const elements2: Element[] = [];
		// allElements.forEach((element, i) => {
		// 	if (element.textContent === 'head') {
		// 		console.log('found head', i);
		// 		insideHeadElement = !insideHeadElement;
		// 		return;
		// 	}

		// 	if (insideHeadElement) {
		// 		return;
		// 	}
		// 	elements2.push(element);
		// });

		// console.log('elements', elements2);

		allElements.forEach((ele, i) => {
			ele.querySelector('.hljs-name')?.addEventListener('click', () => handleElementClick(i));
		});

		// const docu = new DOMParser().parseFromString(get(elements), 'text/html');
		// console.log('docu', docu);
		// const docuElements = docu.querySelectorAll('body *');
		// console.log('docuElements', docuElements);
	}

	onMount(async () => {
		elements.load();
		setTimeout(() => {
			parseHtml();
		}, 500);
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
