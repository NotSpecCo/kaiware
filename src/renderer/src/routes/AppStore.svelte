<script lang="ts">
	import { appStore } from '$lib/stores/appStore';
	import Input from '$lib/ui-components/form/Input.svelte';
	import View from '$lib/ui-components/view/View.svelte';
	import ViewContent from '$lib/ui-components/view/ViewContent.svelte';
	import ViewHeader from '$lib/ui-components/view/ViewHeader.svelte';
	import ViewTab from '$lib/ui-components/view/ViewTab.svelte';
	import ViewTabs from '$lib/ui-components/view/ViewTabs.svelte';
	import type { StoreApp } from '$shared/types/StoreApp';
	import type { StoreCategory } from '$shared/types/StoreCategory';
	import { onMount } from 'svelte';

	let apps: StoreApp[] = [];
	let query: string = '';
	let selectedCategory: StoreCategory | null = null;

	$: {
		apps = $appStore?.apps ?? [];
	}

	onMount(() => {
		appStore.load();
	});

	function search(ev: Event) {
		query = (ev.target as HTMLInputElement).value;
		selectedCategory = null;
		const allApps = $appStore?.apps ?? [];

		apps = query
			? allApps.filter(
					(app) =>
						app.name.toLowerCase().includes(query.toLowerCase()) ||
						app.author.join(' ').toLowerCase().includes(query.toLowerCase())
				) ?? []
			: allApps;
	}

	function viewCategory(category: StoreCategory | null) {
		query = '';
		selectedCategory = category;
		apps = category
			? $appStore?.apps.filter((app) => app.meta.categories.includes(category.id)) ?? []
			: $appStore?.apps ?? [];
	}
</script>

<View>
	<ViewHeader title="App Store">
		<ViewTabs>
			<ViewTab
				href="/apps/store"
				isActive={!selectedCategory}
				on:click={() => viewCategory(null)}
			>
				All
			</ViewTab>
			{#each $appStore?.categories ?? [] as category}
				<ViewTab
					href="/apps/store"
					isActive={category.id === selectedCategory?.id}
					on:click={() => viewCategory(category)}
				>
					{category.name}
				</ViewTab>
			{/each}
		</ViewTabs>
		<div class="spacer"></div>
		<Input placeholder="Search" value={query} on:input={search} />
	</ViewHeader>
	<ViewContent>
		<div class="apps">
			{#each apps as app}
				<div class="app">
					<div class="icon">
						<img src={app.icon} alt="" />
					</div>
					<div class="info">
						<div class="name">{app.name}</div>
						<div class="author">{app.people[0]?.name ?? 'Unknown'}</div>
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

	.apps {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 10px;
	}

	.app {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-radius: 5px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
	}
	.app:hover {
		border-color: var(--accent-primary);
	}

	.icon {
		margin-right: 1rem;
	}

	.icon img {
		width: 50px;
		height: 50px;
		object-fit: contain;
	}

	.info {
		flex: 1;
	}

	.name {
		font-weight: 600;
	}
	.author {
		font-size: 1.2rem;
		color: var(--text-secondary);
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
