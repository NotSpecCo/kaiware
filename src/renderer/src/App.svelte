<script lang="ts">
	import About from '$/routes/About.svelte';
	import Apps from '$/routes/Apps.svelte';
	import Debugger from '$/routes/Debugger.svelte';
	import Device from '$/routes/Device.svelte';
	import Settings from '$/routes/Settings.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';
	import hljs from 'highlight.js';
	import hljsJson from 'highlight.js/lib/languages/json';
	import hljsXml from 'highlight.js/lib/languages/xml';
	import Router from 'svelte-spa-router';
	import Redirect from './routes/Redirect.svelte';

	hljs.registerLanguage('json', hljsJson);
	hljs.registerLanguage('html', hljsXml);

	dayjs.extend(localizedFormat);

	const routes = {
		'/apps': Apps,
		'/device': Device,
		'/debugger': Debugger,
		'/debugger/*': Debugger,
		'/settings': Settings,
		'/about': About,
		'*': Redirect
	};
</script>

<div class="root">
	<Header />
	<div class="main">
		<Sidebar />
		<Router {routes} />
	</div>
	<Footer />
</div>

<style>
	.root {
		height: 100vh;
		/* border: 1px solid red; */
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.main {
		min-height: 0;
		flex: 1;
		display: flex;
	}
</style>
