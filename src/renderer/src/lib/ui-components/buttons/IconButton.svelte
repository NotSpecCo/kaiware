<script lang="ts">
	import { Color } from '$shared/enums/color';
	import { IconSize } from '$shared/enums/iconSize';
	import Icon from '$lib/ui-components/icons/Icon.svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export let icon: any;
	export let color: Color = Color.Primary;
	export let disabled = false;
	export let size: IconSize = IconSize.Medium;
</script>

<button class="root" style={`color: ${color};`} {disabled}>
	<Icon {size} {color}><svelte:component this={icon} /></Icon>
</button>

<style>
	.root {
		outline: none;
		border: none;
		background: none;
		width: 100%;
		padding: 5px;
		text-transform: uppercase;
		font-weight: var(--bold-font-weight);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>
