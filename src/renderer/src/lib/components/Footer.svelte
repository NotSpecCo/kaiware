<script lang="ts">
	import { device } from '$lib/stores/device';
	import Icon from '$lib/ui-components/icons/Icon.svelte';
	import { IconSize } from '$shared/enums/iconSize';
	import { link } from 'svelte-spa-router';
	import IconUsb from '~icons/ion/usb';
	import IconWifi from '~icons/ion/wifi';
	import pkg from '../../../../../package.json';
</script>

<div class="root">
	<div class="device">
		{#if $device?.connectionType === 'usb'}
			<Icon size={IconSize.Smallest} color="var(--success-color)"><IconUsb /></Icon>
		{:else if $device?.connectionType === 'wifi'}
			<Icon size={IconSize.Smallest} color="var(--success-color)"><IconWifi /></Icon>
		{:else}
			<Icon size={IconSize.Smallest} color="var(--tertiary-text-color)"><IconWifi /></Icon>
		{/if}
		<div class="name">{$device?.name ?? 'No device connected'}</div>
	</div>
	<div class="flex"></div>
	<a href="/about" use:link class="version">{`Kaiware v${pkg.version}`}</a>
</div>

<style>
	.root {
		font-size: 1.4rem;
		color: var(--secondary-text-color);
		padding: 5px 10px;
		display: flex;
	}

	.device {
		display: flex;
		align-items: center;
	}

	.device > .name {
		margin-left: 7px;
	}

	.flex {
		flex: 1;
	}

	.version {
		border-bottom: 1px solid transparent;
		text-decoration: none;
	}
	.version:hover {
		border-color: var(--accent-color);
	}
</style>
