<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import hljs from 'highlight.js';
	import hljsJson from 'highlight.js/lib/languages/json';
	import hljsXml from 'highlight.js/lib/languages/xml';
	import Router from 'svelte-spa-router';
	import wrap from 'svelte-spa-router/wrap';
	import Redirect from './routes/Redirect.svelte';

	hljs.registerLanguage('json', hljsJson);
	hljs.registerLanguage('html', hljsXml);

	dayjs.extend(localizedFormat);

	const routes = {
		'/apps': wrap({
			asyncComponent: () => import('$/routes/Apps.svelte')
		}),
		'/device': wrap({
			asyncComponent: () => import('$/routes/Device.svelte')
		}),
		'/debugger': wrap({
			asyncComponent: () => import('$/routes/Debugger.svelte')
		}),
		'/debugger/*': wrap({
			asyncComponent: () => import('$/routes/Debugger.svelte')
		}),
		'/settings': wrap({
			asyncComponent: () => import('$/routes/Settings.svelte')
		}),
		'/about': wrap({
			asyncComponent: () => import('$/routes/About.svelte')
		}),
		'*': Redirect
	};
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
