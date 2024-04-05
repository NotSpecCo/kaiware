<script>
	import { Color } from '$lib/enums/color';
	import { IconSize } from '$lib/enums/iconSize';
	import IconButton from '$lib/ui-components/buttons/IconButton.svelte';
	import Settings from '~icons/ion/ios-settings';
	import IconAccountBox from '~icons/mdi/account-box';
</script>

<div class="root">
	<div class="macos-buttons"></div>
	<div class="content">K</div>
	<div class="menu">
		<IconButton icon={IconAccountBox} color={Color.Primary} size={IconSize.Small} />
		<IconButton icon={Settings} color={Color.Primary} size={IconSize.Small} />
	</div>
</div>

<style>
	.root {
		border: 1px solid red;
		height: 30px;

		-webkit-app-region: drag;
		display: flex;
		padding-left: 70px;
		align-items: center;
	}

	.menu {
		display: flex;
	}
</style>
