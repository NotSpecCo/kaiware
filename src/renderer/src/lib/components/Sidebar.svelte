<script>
	import { link, location } from 'svelte-spa-router';
</script>

<div class="root">
	<div class="app">
		<img src="/src/assets/images/icon_256.png" alt="App icon" class="logo" />
		<div class="name">Kaiware</div>
	</div>
	<div class="divider"></div>
	<div class="nav">
		<a href="/apps" use:link class:active={$location === '/apps'}>Apps</a>
		<a href="/device" use:link class:active={$location === '/device'}>Device</a>
		<a href="/dev-tools" use:link class:active={$location.startsWith('/dev-tools')}>
			Dev Tools
		</a>
		<div class="divider"></div>
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
		height: 1px;
		background-color: rgba(255, 255, 255, 0.1);
		margin: 10px 10px;
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
	}
	.nav > a.active {
		border-color: var(--accent-primary);
	}
</style>
