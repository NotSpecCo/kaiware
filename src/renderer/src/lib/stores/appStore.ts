import { Storage } from '$lib/utils/storage';
import type { StoreApp } from '$shared/types/StoreApp';
import type { StoreCategory } from '$shared/types/StoreCategory';
import { get, writable } from 'svelte/store';

type StoreDb = {
	categories: StoreCategory[];
	apps: StoreApp[];
	fetchedAt: number;
	generatedAt: number;
};

function createStore() {
	const store = writable<StoreDb | null>(null);

	async function load() {
		const result = await fetchStoreData();
		store.set(result);
	}

	async function fetchStoreData(forceRefresh = false): Promise<StoreDb> {
		const cachedStoreData = Storage.local.get<StoreDb>('store-db');

		if (
			cachedStoreData &&
			!forceRefresh &&
			new Date().valueOf() - cachedStoreData.fetchedAt < 1_800_000
		) {
			return cachedStoreData;
		}

		const data = await fetch('https://banana-hackers.gitlab.io/store-db/data.json')
			.then((res) => res.json())
			.then((res) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				res.apps = res.apps.map((a: any) => {
					const people = [
						...a.author.map((person: string) => {
							const emailMatch = person.match(/(.*)[ ]?<(.*@.*)>/);
							const urlMatch = person.match(/(.*)[ ]?<(http.*)>/);
							return {
								name: emailMatch?.[1] || urlMatch?.[1] || person,
								email: emailMatch?.[2] || undefined,
								website: urlMatch?.[2] || undefined,
								role: 'author'
							};
						}),
						...a.maintainer.map((person: string) => {
							const emailMatch = person.match(/(.*)[ ]?<(.*@.*)>/);
							const urlMatch = person.match(/(.*)[ ]?<(http.*)>/);
							return {
								name: emailMatch?.[1] || urlMatch?.[1] || person,
								email: emailMatch?.[2] || undefined,
								website: urlMatch?.[2] || undefined,
								role: 'maintainer'
							};
						})
					];

					return {
						...a,
						people
					};
				});

				return res;
			});
		const categories: StoreCategory[] = Object.keys(data.categories).map((key) => ({
			...(data.categories as unknown as { [key: string]: Omit<StoreCategory, 'id'> })[key],
			id: key
		}));
		const storeData = {
			categories,
			apps: data.apps,
			fetchedAt: new Date().valueOf(),
			generatedAt: data.generated_at
		};

		Storage.local.set('store-db', storeData);
		return storeData;
	}

	async function getAppBySlug(slug: string): Promise<StoreApp | null> {
		const data = get(store);
		if (!data) {
			await load();
		}

		const app = data?.apps.find((a) => a.slug === slug);
		return app || null;
	}

	async function fetchAppVersion(manifestUrl: string): Promise<string> {
		const res = await fetch(manifestUrl)
			.then((res) => res.json() as { version?: string })
			.catch((err) => {
				console.log('Failed to get app version', err);
				return null;
			});

		return res?.version || '';
	}

	function reset() {
		store.set(null);
	}

	return {
		subscribe: store.subscribe,
		set: store.set,
		reset,
		load,
		getAppBySlug,
		fetchAppVersion
	};
}

export const appStore = createStore();
