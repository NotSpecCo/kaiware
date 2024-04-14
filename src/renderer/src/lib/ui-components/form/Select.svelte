<script lang="ts">
	import Icon from '$lib/ui-components/icons/Icon.svelte';
	import { IconSize } from '$shared/enums/iconSize';
	import { createEventDispatcher } from 'svelte';
	import IconArrow from '~icons/ion/ios-arrow-down';

	export let value = '';
	export let options: { value: string; label: string }[];
	export let placeholder: string;

	const dispatch = createEventDispatcher();

	let displayText = '';
	$: displayText = options.find((a) => a.value === value)?.label || placeholder;

	function handleChange(event) {
		dispatch('change', {
			value: event.target.value
		});
	}
</script>

<div class="root">
	<div class="overlay">
		<div class="display-text" class:empty={!value}>{displayText}</div>
		<Icon size={IconSize.Smallest} color="var(--text-secondary)"><IconArrow /></Icon>
	</div>
	<select class="select" bind:value on:change={handleChange}>
		<option value=""></option>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>

<style>
	.root {
		position: relative;
	}

	.overlay {
		border: 2px solid rgba(255, 255, 255, 0.15);
		padding: 5px 10px 5px 15px;
		display: flex;
		align-items: center;
		background-color: var(--background-light);
		pointer-events: none;
		z-index: 10;
		border-radius: 15px;
		height: 30px;
	}

	.root:focus-within .overlay {
		border-color: var(--accent-primary);
	}

	.display-text {
		color: var(--text-primary);
		margin-right: 7px;
	}
	.display-text.empty {
		color: var(--text-secondary);
	}

	.select {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		opacity: 0;
	}
</style>
