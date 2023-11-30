import { Initialize } from '@app/initialize';
import type {ProjectMetadata} from '@lib/api/project/types/ProjectMetadata';
interface InternalStorage {
  variables: Record<string, string[]> | null;
  maps: Record<string, string[]> | null;
  lists: Record<string, string[]> | null;
}
export default class Storage {
	public static instance: Storage;
	private storage: InternalStorage;
	private static key = '';
	private constructor(storage: InternalStorage) {
		this.storage = storage;
	}
	static init(projectMetadata: ProjectMetadata) {
		Storage.key = `creatif-${Initialize.ProjectID()}-${Initialize.ApiKey().substring(0, 10)}`;
		// remove previous project keys. This is to reduce the load on local storage if localhost
		// is used with multiple project
		const keys = Object.keys(localStorage);
		for (const key of keys) {
			if (key !== Storage.key) {
				localStorage.removeItem(key);
			}
		}

		const locale = Initialize.Locale();
		const internalStorage: InternalStorage = {
			variables: projectMetadata.variables || {[locale]: []},
			maps: projectMetadata.maps ? projectMetadata.maps : {[locale]: []},
			lists: projectMetadata.lists ? projectMetadata.lists : {[locale]: []},
		};

		localStorage.setItem(Storage.key, JSON.stringify(internalStorage));
		Storage.instance = new Storage(internalStorage);
	}
	addList(name: string, locale: string) {
		if (this.storage.lists) {
			if (!this.storage.lists[locale]) {
				this.storage.lists[locale] = [];
			}

			this.storage.lists[locale].push(name);

			this.persist();
		}
	}
	hasList(name: string, locale: string): boolean {
		if (!this.storage.lists) return false;

		if (!this.storage.lists[locale]) return false;
		return Boolean(
			this.storage.lists[locale].find((item) => item === name),
		);
	}
	private persist() {
		localStorage.setItem(Storage.key, JSON.stringify(this.storage));
	}


}
