<script lang="ts">
	import { replace } from 'svelte-spa-router';

	// eslint-disable-next-line svelte/valid-compile
	export let params = {};

	replace('/logs');
</script>
