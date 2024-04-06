<script lang="ts">
	import View from '$lib/ui-components/view/View.svelte';
	import ViewContent from '$lib/ui-components/view/ViewContent.svelte';
	import ViewHeader from '$lib/ui-components/view/ViewHeader.svelte';
	import Router, { link, location, replace } from 'svelte-spa-router';
	import Logs from './Logs.svelte';
	import Network from './Network.svelte';

	if ($location === '/debugger') {
		replace('/debugger/logs');
	}

	const prefix = '/debugger';
	const routes = {
		'/logs': Logs,
		'/network': Network
	};
</script>

<View>
	<ViewHeader title="Remote Debugger">
		<!-- <a
			href="/debugger/elements"
			use:link
			class="nav-link"
			class:active={$location === '/debugger/elements'}
		>
			Elements
		</a> -->
		<a
			href="/debugger/logs"
			use:link
			class="nav-link"
			class:active={$location === '/debugger/logs'}
		>
			Logs
		</a>
		<!-- <a
			href="/debugger/console"
			use:link
			class="nav-link"
			class:active={$location === '/debugger/console'}
		>
			Console
		</a> -->
		<a
			href="/debugger/network"
			use:link
			class="nav-link"
			class:active={$location === '/debugger/network'}
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
		font-size: 1.8rem;
		margin-right: 15px;
		margin-bottom: -2px;
		border-bottom: 3px solid transparent;
	}
	.nav-link.active {
		border-color: var(--accent-primary);
	}
</style>
