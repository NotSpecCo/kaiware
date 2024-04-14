<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import Input from '$lib/ui-components/form/Input.svelte';
	import Select from '$lib/ui-components/form/Select.svelte';
	import View from '$lib/ui-components/view/View.svelte';
	import ViewContent from '$lib/ui-components/view/ViewContent.svelte';
	import ViewHeader from '$lib/ui-components/view/ViewHeader.svelte';
	import type { StoreApp } from '$shared/types/StoreApp';
	import { onMount } from 'svelte';

	let apps: StoreApp[] = [];
	let query: string = '';
	let selectedCategoryId: string = '';

	$: {
		apps = $appStore?.apps ?? [];
	}

	onMount(() => {
		appStore.load();
	});

	function search(ev: Event) {
		query = (ev.target as HTMLInputElement).value;
		let result = $appStore?.apps ?? [];

		if (selectedCategoryId) {
			result = result.filter((app) => app.meta.categories.includes(selectedCategoryId));
		}

		if (query) {
			result = result.filter(
				(app) =>
					app.name.toLowerCase().includes(query.toLowerCase()) ||
					app.people[0]?.name.toLowerCase().includes(query.toLowerCase())
			);
		}

		apps = result;
	}

	function handleCategoryChange(event) {
		selectedCategoryId = event.detail.value;
		let result = $appStore?.apps ?? [];

		if (selectedCategoryId) {
			result = result.filter((app) => app.meta.categories.includes(selectedCategoryId));
		}

		apps = result;
	}
</script>

<View>
	<ViewHeader title="App Store">
		<div class="flex"></div>
		<Select
			value={selectedCategoryId}
			placeholder="Choose a category..."
			options={$appStore?.categories.map((category) => ({
				value: category.id,
				label: category.name
			})) ?? []}
			on:change={handleCategoryChange}
		></Select>
		<div class="spacer"></div>
		<Input placeholder="Search" value={query} on:input={search} />
	</ViewHeader>
	<ViewContent>
		<div class="apps">
			{#each apps as app (app.slug)}
				<div class="app-row">
					<div class="app">
						<div class="icon">
							<img
								src={app.icon}
								alt={app.name}
								on:error={function () {
									this.src = 'src/assets/images/default-app-icon.png';
								}}
							/>
						</div>
						<div class="info">
							<div class="name">{app.name}</div>
							<div class="author">{app.people[0]?.name}</div>
						</div>
					</div>
					<div class="description">
						{app.description.length > 300
							? `${app.description.slice(0, 300)}...`
							: app.description}
					</div>
				</div>
			{/each}
		</div>
	</ViewContent>
</View>

<style>
	.spacer {
		width: 10px;
	}

	.flex {
		flex: 1;
	}

	.app-row {
		border-bottom: 1px solid rgba(255, 255, 255, 0.15);
		padding-bottom: 10px;
		margin-bottom: 10px;
	}
	.app-row:last-of-type {
		border-bottom: none;
	}

	.app {
		display: flex;
		margin-bottom: 5px;
	}

	.icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 8px;
	}
	.icon > img {
		width: 50px;
		height: 50px;
	}

	.info {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.name {
		font-weight: 600;
		font-size: 1.6rem;
	}

	.author {
		color: var(--text-secondary);
	}

	.description {
		/* color: var(--text-secondary); */
	}
</style>
