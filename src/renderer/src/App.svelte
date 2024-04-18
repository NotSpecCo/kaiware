<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { device } from '$lib/stores/device';
	import { onMount } from 'svelte';
	import Router, { location, push } from 'svelte-spa-router';
	import About from './routes/About.svelte';
	import AppStore from './routes/AppStore.svelte';
	import Dashboard from './routes/Dashboard.svelte';
	import DevTools from './routes/DevTools.svelte';
	import Device from './routes/Device.svelte';
	import Redirect from './routes/Redirect.svelte';
	import Settings from './routes/Settings.svelte';

	const routes = {
		'/dashboard': Dashboard,
		'/apps/store': AppStore,
		'/device': Device,
		'/dev-tools': DevTools,
		'/dev-tools/*': DevTools,
		'/settings': Settings,
		'/about': About,
		'*': Redirect
	};

	onMount(() => {
		let firstValue = true;
		const unsubscribe = device.subscribe((val) => {
			if (firstValue) {
				firstValue = false;
				return;
			}

			const deviceRequiredPages = [
				'/dev-tools/elements',
				'/dev-tools/network',
				'/dev-tools/storage'
			];
			if (val === null && deviceRequiredPages.includes($location)) {
				push('/dashboard');
			}
		});

		return () => unsubscribe();
	});
</script>

<div class="root">
	<Header />
	<main>
		<Sidebar />
		<Router {routes} />
	</main>
	<Footer />
</div>

<style>
	.root {
		height: 100vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.root > main {
		min-height: 0;
		flex: 1;
		display: flex;
	}
</style>
