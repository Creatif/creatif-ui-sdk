import { Initialize } from '@app/initialize';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
interface InternalStorage {
    variables: Record<string, string[]> | null;
    maps: Record<string, string[]> | null;
    lists: string[] | null;
    projectName: string;
}
export default class StructureStorage {
    public static instance: StructureStorage;
    private storage: InternalStorage;
    private static key = '';
    private constructor(storage: InternalStorage) {
        this.storage = storage;
    }
    static init(projectMetadata: ProjectMetadata) {
        StructureStorage.key = `creatif-${Initialize.ProjectID()}`;

        const locale = Initialize.Locale();
        const internalStorage: InternalStorage = {
            variables: projectMetadata.variables || { [locale]: [] },
            maps: projectMetadata.maps ? projectMetadata.maps : { [locale]: [] },
            lists: projectMetadata.lists,
            projectName: projectMetadata.name,
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

    removeVariable(name: string) {
        const locale = Initialize.Locale();
        if (this.storage.variables && this.storage.variables[locale]) {
            const idx = this.storage.variables[locale].findIndex((item) => item === name);
            if (idx !== -1) {
                this.storage.variables[locale].splice(idx, 1);
            }
        }
    }
    addVariable(name: string, locale: string) {
        if (this.storage.variables) {
            if (!this.storage.variables[locale]) {
                this.storage.variables[locale] = [];
            }

            this.storage.variables[locale].push(name);
        }
    }

    projectName(): string {
        return this.storage.projectName;
    }

    hasVariable(name: string, locale: string) {
        if (!this.storage.variables) return false;

        if (!this.storage.variables[locale]) return false;

        return this.storage.variables[locale].includes(name);
    }
    private persist() {
        localStorage.setItem(StructureStorage.key, JSON.stringify(this.storage));
    }
}
