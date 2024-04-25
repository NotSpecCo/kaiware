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
		color: var(--primary-text-color);
	}

	input::placeholder {
		color: var(--secondary-text-color);
	}
	input:focus {
		outline: var(--accent-color) solid 1px;
	}
</style>
