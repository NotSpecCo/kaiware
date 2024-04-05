<script lang="ts">
	export let title: string | null = null;
</script>

<div class="root">
	{#if title}
		<div class="title">{title}</div>
	{/if}
	<slot />
</div>

<style>
	.root {
		padding: 15px 15px 10px 15px;
		display: flex;
		align-items: center;
	}

	.title {
		font-size: 2.2rem;
		font-weight: 500;
		line-height: 1;
		margin-right: 20px;
	}
</style>
