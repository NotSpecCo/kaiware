<script lang="ts">
	import { link } from 'svelte-spa-router';

	export let href: string;
	export let isActive: boolean = false;
</script>

<a {href} use:link class="link" class:active={isActive} on:click>
	<slot />
</a>

<style>
	.link {
		appearance: none;
		text-decoration: none;
		cursor: pointer;
		position: relative;
		font-size: 1.6rem;
		margin-right: 15px;
		padding-bottom: 3px;
		display: block;
		flex-shrink: 0;
	}

	.link.active::after,
	.link:hover::after {
		content: '';
		cursor: pointer;
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 3px;
		background-color: var(--accent-color);
	}
</style>
