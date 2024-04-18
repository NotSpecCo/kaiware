<script lang="ts">
	import { device } from '$lib/stores/device';
	import Icon from '$lib/ui-components/icons/Icon.svelte';
	import { IconSize } from '$shared/enums/iconSize';
	import IconUsb from '~icons/ion/usb';
	import IconWifi from '~icons/ion/wifi';
	import pkg from '../../../../../package.json';
</script>

<div class="root">
	<div class="device">
		{#if $device?.connectionType === 'usb'}
			<Icon size={IconSize.Smallest} color="var(--text-success)"><IconUsb /></Icon>
		{:else if $device?.connectionType === 'wifi'}
			<Icon size={IconSize.Smallest} color="var(--text-success)"><IconWifi /></Icon>
		{:else}
			<Icon size={IconSize.Smallest} color="var(--text-tertiary)"><IconWifi /></Icon>
		{/if}
		<div class="name">{$device?.name ?? 'No device connected'}</div>
	</div>
	<div class="flex"></div>
	<div class="version">{`Kaiware v${pkg.version}`}</div>
</div>

<style>
	.root {
		font-size: 1.4rem;
		color: var(--text-secondary);
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
</style>
