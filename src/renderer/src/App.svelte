<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import LogViewer from './routes/LogViewer.svelte';
	import Redirect from './routes/Redirect.svelte';

	import Titlebar from '$lib/components/Titlebar.svelte';
	import { logs } from '$lib/stores/logs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import Router from 'svelte-spa-router';
	dayjs.extend(localizedFormat);

	const routes = {
		'/logs': LogViewer,
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
	}
</style>
