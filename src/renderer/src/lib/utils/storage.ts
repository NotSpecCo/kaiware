type StorageKey = 'settings' | 'store-db';

export class Storage {
	static local = {
		get<T>(key: StorageKey): T {
			const data = localStorage.getItem(key);
			return data ? JSON.parse(data) : null;
		},
		set<T>(key: StorageKey, value: T): void {
			localStorage.setItem(key, JSON.stringify(value));
		}
	};

	static session = {
		get<T>(key: StorageKey): T {
			const data = sessionStorage.getItem(key);
			return data ? JSON.parse(data) : null;
		},
		set<T>(key: StorageKey, value: T): void {
			sessionStorage.setItem(key, JSON.stringify(value));
		}
	};
}
