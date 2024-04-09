<script lang="ts">
	import View from '$lib/ui-components/view/View.svelte';
	import ViewContent from '$lib/ui-components/view/ViewContent.svelte';
	import ViewHeader from '$lib/ui-components/view/ViewHeader.svelte';
	import Router, { link, location, replace } from 'svelte-spa-router';
	import Elements from './Elements.svelte';
	import Logs from './Logs.svelte';
	import Network from './Network.svelte';

	if ($location === '/dev-tools') {
		replace('/dev-tools/elements');
	}

	const prefix = '/dev-tools';
	const routes = {
		'/elements': Elements,
		'/logs': Logs,
		'/network': Network
	};
</script>

<View>
	<ViewHeader title="Dev Tools">
		<a
			href="/dev-tools/elements"
			use:link
			class="nav-link"
			class:active={$location === '/dev-tools/elements'}
		>
			Elements
		</a>
		<a
			href="/dev-tools/logs"
			use:link
			class="nav-link"
			class:active={$location === '/dev-tools/logs'}
		>
			Logs
		</a>
		<!-- <a
			href="/dev-tools/console"
			use:link
			class="nav-link"
			class:active={$location === '/dev-tools/console'}
		>
			Console
		</a> -->
		<a
			href="/dev-tools/network"
			use:link
			class="nav-link"
			class:active={$location === '/dev-tools/network'}
		>
			Network
		</a>
	</ViewHeader>
	<ViewContent>
		<Router {routes} {prefix} />
	</ViewContent>
</View>

<style>
	.nav-link {
		font-size: 1.6rem;
		margin-right: 15px;
		margin-bottom: -2px;
		border-bottom: 3px solid transparent;
	}
	.nav-link.active {
		border-color: var(--accent-primary);
	}
</style>
