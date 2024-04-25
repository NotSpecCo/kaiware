<div class="root">
	<slot />
</div>

<style>
	.root {
		background-color: var(--panel-background-color);
		height: 100%;
		width: 100%;
		border-radius: var(--radius) 0 0 var(--radius);
		overflow: hidden;
		border: 1px solid var(--panel-border-color);
		display: flex;
		flex-direction: column;
	}
</style>
