<script lang="ts">
	import About from '$/routes/About.svelte';
	import Settings from '$/routes/Settings.svelte';
	import Titlebar from '$lib/components/Titlebar.svelte';
	import { logs } from '$lib/stores/logs';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import { onMount } from 'svelte';
	import Router from 'svelte-spa-router';
	import Logs from './routes/Logs.svelte';
	import Network from './routes/Network.svelte';
	import Redirect from './routes/Redirect.svelte';

	dayjs.extend(localizedFormat);

	const routes = {
		'/logs': Logs,
		'/network': Network,
		'/settings': Settings,
		'/about': About,
		'*': Redirect
	};

	onMount(async () => {
		window.electron.ipcRenderer.send('ping');
		logs.load();
	});
</script>

<div class="root">
	<Titlebar />
	<div class="content">
		<Router {routes} />
	</div>
</div>

<style>
	.root {
		height: 100vh;
		/* border: 1px solid red; */
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.content {
		min-height: 0;
		flex: 1;
	}
</style>
