<script>
	import { settings } from '$lib/stores/settings';
	import View from '$lib/ui-components/view/View.svelte';
	import ViewContent from '$lib/ui-components/view/ViewContent.svelte';
	import ViewHeader from '$lib/ui-components/view/ViewHeader.svelte';

	console.log('Settings', $settings);
</script>

<View>
	<ViewHeader title="Settings" />
	<ViewContent>Settings</ViewContent>
</View>
