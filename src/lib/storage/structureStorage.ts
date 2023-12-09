import { Initialize } from '@app/initialize';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
interface InternalStorage {
  variables: Record<string, string[]> | null;
  maps: Record<string, string[]> | null;
  lists: string[] | null;
}
export default class StructureStorage {
	public static instance: StructureStorage;
	private storage: InternalStorage;
	private static key = '';
	private constructor(storage: InternalStorage) {
		this.storage = storage;
	}
	static init(projectMetadata: ProjectMetadata) {
		StructureStorage.key = `creatif-${Initialize.ProjectID()}-${Initialize.ApiKey().substring(
			0,
			10,
		)}`;
		// remove previous project keys. This is to reduce the load on local storage if localhost
		// is used with multiple project
		const undeleteableKeys = ['creatif-current-locale'];
		const keys = Object.keys(localStorage);
		for (const key of keys) {
			if (key !== StructureStorage.key && !undeleteableKeys.includes(key)) {
				localStorage.removeItem(key);
			}
		}

		const locale = Initialize.Locale();
		const internalStorage: InternalStorage = {
			variables: projectMetadata.variables || { [locale]: [] },
			maps: projectMetadata.maps ? projectMetadata.maps : { [locale]: [] },
			lists: projectMetadata.lists,
		};

		localStorage.setItem(StructureStorage.key, JSON.stringify(internalStorage));
		StructureStorage.instance = new StructureStorage(internalStorage);
	}
	addList(name: string) {
		if (this.storage.lists) {
			if (!this.storage.lists.includes(name)) {
				this.storage.lists = [];
			}

			this.storage.lists.push(name);

			this.persist();
		}
	}
	hasList(name: string): boolean {
		if (!this.storage.lists) return false;

		if (!this.storage.lists.includes(name)) return false;
		return Boolean(this.storage.lists.find((item) => item === name));
	}
	private persist() {
		localStorage.setItem(StructureStorage.key, JSON.stringify(this.storage));
	}
}
