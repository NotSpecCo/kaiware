<script lang="ts">
	import Scroller from '$lib/ui-components/Scroller.svelte';
</script>

<div class="root">
	<Scroller direction="horizontal">
		<slot />
	</Scroller>
</div>

<style>
	.root {
		flex: 1;
		padding-top: 3px;
	}
</style>
