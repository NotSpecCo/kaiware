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
	on:input
	on:keydown
/>

<style>
	input {
		padding: 3px 5px;
		border: none;
		background-color: inherit;
		color: var(--text-primary);
	}

	input::placeholder {
		color: var(--text-secondary);
	}
	input:focus {
		outline: var(--accent-primary) solid 1px;
	}
</style>
