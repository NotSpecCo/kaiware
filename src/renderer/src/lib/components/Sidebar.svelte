<script>
	import { device } from '$lib/stores/device';
	import { link, location } from 'svelte-spa-router';
</script>

<div class="root">
	<div class="app">
		<img src="/src/assets/images/icon_256.png" alt="App icon" class="logo" />
		<div class="name">Kaiware</div>
	</div>
	<div class="divider"></div>
	<div class="nav">
		<a href="/dashboard" use:link class:active={$location === '/dashboard'}>Dashboard</a>

		<div class="divider named">Dev Tools</div>
		<a href="/dev-tools/logs" use:link class:active={$location === '/dev-tools/logs'}>Logs</a>
		<a
			href="/dev-tools/elements"
			use:link
			class:active={$location === '/dev-tools/elements'}
			class:disabled={$device === null}
		>
			Elements
		</a>
		<a href="/dev-tools/network" use:link class:active={$location === '/dev-tools/network'}>
			Network
		</a>
		<a
			href="/dev-tools/storage"
			use:link
			class:active={$location === '/dev-tools/storage'}
			class:disabled={$device === null}
		>
			Storage
		</a>
		<a
			href="/dev-tools/console"
			use:link
			class:active={$location === '/dev-tools/console'}
			class:disabled={$device === null}
		>
			Console
		</a>

		<div class="divider named">Apps</div>
		<a href="/apps/store" use:link class:active={$location === '/apps/store'}>App Store</a>
		<!-- <a href="/device" use:link class:active={$location === '/device'}>Device</a> -->

		<div class="divider named">Misc</div>
		<a href="/settings" use:link class:active={$location === '/settings'}>Settings</a>
	</div>
</div>

<style>
	.root {
		width: 200px;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.app {
		display: flex;
		padding: 7px 10px;
		align-items: center;
	}

	.divider {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin: 10px 10px;
	}

	.divider.named {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 5px;
		color: var(--secondary-text-color);
	}

	.logo {
		height: 32px;
		width: 32px;
		margin-right: 5px;
	}

	.name {
		font-size: 2.6rem;
		font-weight: 500;
		line-height: 1;
	}

	.nav {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.nav > a {
		display: block;
		padding: 5px 10px;
		font-size: 1.6rem;
		border-left: 5px solid transparent;
		text-decoration: none;
	}
	.nav > a.active {
		border-color: var(--accent-color);
	}
	.nav > a:hover {
		border-color: var(--accent-color);
	}

	.nav > a.disabled {
		opacity: 0.4;
		pointer-events: none;
	}
</style>
