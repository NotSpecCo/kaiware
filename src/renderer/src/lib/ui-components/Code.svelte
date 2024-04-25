<script lang="ts">
	export let fullHeight = false;
</script>

<pre class="root" class:full-height={fullHeight}><code><slot /></code></pre>

<style>
	.root {
		font-size: 1.2rem;
		overflow: auto;
		background-color: var(--main-background-color);
		padding: 10px;
		margin-bottom: 15px;
		border-radius: var(--radius);
	}

	.full-height {
		height: 100%;
	}
</style>
