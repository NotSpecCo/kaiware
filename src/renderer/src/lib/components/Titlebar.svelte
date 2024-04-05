<script>
	import { link, location } from 'svelte-spa-router';
</script>

<div class="root">
	<div class="macos-buttons"></div>
	<div class="nav">
		<a href="/logs" use:link class:active={$location === '/logs'}>Logs</a>
		<a href="/network" use:link class:active={$location === '/network'}>Network</a>
		<a href="/settings" use:link class:active={$location === '/settings'}>Settings</a>
	</div>
	<div class="flex"></div>
	<a href="/about" use:link class="logo-link">
		<img src="/src/assets/images/icon_256.png" alt="" class="logo" />
	</a>
</div>

<style>
	.root {
		min-height: 38px;
		max-height: 38px;

		-webkit-app-region: drag;
		display: flex;
		padding-left: 85px;
		padding-right: 10px;
		align-items: center;
		font-size: 1.8rem;
	}

	.flex {
		flex: 1;
	}

	.nav {
		display: flex;
	}

	.nav > a {
		margin-right: 15px;
		font-weight: 500;
		-webkit-app-region: no-drag;
	}

	.nav > a:hover {
		color: #febe2a;
		text-decoration: underline;
	}

	.nav > a.active {
		color: #febe2a;
		text-decoration: underline;
	}

	.logo-link {
		-webkit-app-region: no-drag;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo {
		width: 32px;
		height: 32px;
	}
</style>
