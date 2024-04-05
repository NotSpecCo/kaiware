<div class="root">
	<slot />
</div>

<style>
	.root {
		background-color: var(--panel-background);
		height: 100%;
		width: 100%;
		border-radius: 24px 0 0 24px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.05);
		display: flex;
		flex-direction: column;
	}
</style>
