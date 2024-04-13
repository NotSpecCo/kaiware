<script lang="ts">
	import { onMount } from 'svelte';

	export let direction: 'vertical' | 'horizontal' = 'horizontal';

	let scroller: HTMLElement;
	let scrollPositionH = 0;
	let scrollPositionV = 0;
	let hideAll = false;

	onMount(() => {
		handleScroll(scroller);
	});

	function handleScroll(ele: EventTarget | null) {
		if (!ele) return;

		const element = ele as HTMLElement;

		if (direction === 'horizontal' && scroller.scrollWidth <= scroller.clientWidth) {
			hideAll = true;
			scrollPositionH = 0;
		} else if (direction === 'vertical' && scroller.scrollHeight <= scroller.clientHeight) {
			hideAll = true;
			scrollPositionV = 0;
		} else {
			hideAll = false;
			scrollPositionH = Math.round(
				(element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100
			);
			scrollPositionV = Math.round(
				(element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100
			);
		}
	}
</script>

<div
	class="container"
	class:vertical={direction === 'vertical'}
	class:horizontal={direction === 'horizontal'}
	class:hide-left={hideAll || scrollPositionH === 0}
	class:hide-right={hideAll || scrollPositionH === 100}
	class:hide-top={hideAll || scrollPositionV === 0}
	class:hide-bottom={hideAll || scrollPositionV === 100}
>
	<div class="content" bind:this={scroller} on:scroll={(ev) => handleScroll(ev.target)}>
		<slot />
	</div>
</div>

<style>
	.container {
		position: relative;
		display: flex;
	}
	.container.horizontal::before,
	.container.horizontal::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		width: 50px;
		background: none;
		z-index: 10;
		pointer-events: none;
	}
	.container.horizontal:not(.hide-left)::before {
		left: 0;
		background: linear-gradient(90deg, var(--background-light), transparent);
	}
	.container.horizontal:not(.hide-right)::after {
		right: 0;
		background: linear-gradient(90deg, transparent, var(--background-light));
	}

	.container.vertical::before,
	.container.vertical::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 50px;
		background: none;
		z-index: 10;
		pointer-events: none;
	}
	.container.vertical:not(.hide-top)::before {
		top: 0;
		background: linear-gradient(var(--background-light), transparent);
	}
	.container.vertical:not(.hide-bottom)::after {
		bottom: 0;
		background: linear-gradient(transparent, var(--background-light));
	}

	.horizontal .content {
		overflow-x: auto;
		white-space: nowrap;
		position: relative;
		display: flex;
	}
	.vertical .content {
		overflow-y: auto;
		white-space: nowrap;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.content::-webkit-scrollbar {
		display: none;
	}
</style>
