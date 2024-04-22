<script lang="ts">
	export let value = '';
	export let placeholder = '';
	export let width: string = '';
</script>

<input
	type="text"
	name=""
	id=""
	{placeholder}
	{value}
	style={width ? `width: ${width}` : ''}
	spellcheck="false"
	on:input
	on:keydown
/>

<style>
	input {
		padding: 5px 10px;
		border: none;
		border: 2px solid rgba(255, 255, 255, 0.15);
		border-radius: 15px;
		background-color: var(--background-light);
		color: var(--text-primary);
		font-size: 1.4rem;
		height: 30px;
	}

	input::placeholder {
		color: var(--text-secondary);
	}
	input:focus {
		outline: var(--accent-primary) solid 2px;
	}
</style>
