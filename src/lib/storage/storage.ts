import { Initialize } from '@app/initialize';
interface InternalVariable {
  name: string;
}
interface InternalMap {
  name: string;
  variables: string[];
}
interface InternalList {
  name: string;
}
interface InternalStorage {
  variables: Record<string, InternalVariable[]>;
  maps: Record<string, InternalMap[]>;
  lists: Record<string, InternalList[]>;
}
export default class Storage {
	public static instance: Storage;
	private storage: InternalStorage;
	private static key = '';
	private constructor(storage: InternalStorage) {
		this.storage = storage;
	}
	static init() {
		Storage.key = `creatif-${Initialize.ProjectID()}-${Initialize.ApiKey().substring(0, 10)}`;
		const s = localStorage.getItem(Storage.key);
		if (!s) {
			const internalStorage = {
				variables: {
					[Initialize.Locale()]: [],
				},
				maps: {
					[Initialize.Locale()]: [],
				},
				lists: {
					[Initialize.Locale()]: [],
				},
			};

			localStorage.setItem(Storage.key, JSON.stringify(internalStorage));
			Storage.instance = new Storage(internalStorage);

			return;
		}

		Storage.instance = new Storage(JSON.parse(s));
	}
	addList(name: string, locale: string) {
		if (!this.storage.lists[locale]) {
			this.storage.lists[locale] = [];
		}

		this.storage.lists[locale].push({
			name: name,
		});

		this.persist();
	}
	hasList(name: string, locale: string): boolean {
		if (!this.storage.lists[locale]) return false;
		return Boolean(
			this.storage.lists[locale].find((item) => item.name === name),
		);
	}
	private persist() {
		localStorage.setItem(Storage.key, JSON.stringify(this.storage));
	}
}
