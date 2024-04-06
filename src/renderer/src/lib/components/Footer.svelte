<script lang="ts">
	import { IconSize } from '$shared/enums/iconSize';
	import Icon from '$lib/ui-components/icons/Icon.svelte';
	import IconUsb from '~icons/ion/usb';
</script>

<div class="root">
	<div class="device">
		<Icon size={IconSize.Smallest}><IconUsb /></Icon>
		<div class="name">No device connected</div>
	</div>
	<div class="flex"></div>
	<div class="version">Kaiware v0.1.0</div>
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
		margin-left: 5px;
	}

	.flex {
		flex: 1;
	}
</style>
