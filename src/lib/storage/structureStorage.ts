import { Credentials } from '@app/credentials';
import type { ProjectMetadata, Structure } from '@lib/api/project/types/ProjectMetadata';
export default class StructureStorage {
    public static instance: StructureStorage;
    private storage: ProjectMetadata;
    private static key = '';
    private constructor(storage: ProjectMetadata) {
        this.storage = storage;
    }
    static init(projectMetadata: ProjectMetadata) {
        StructureStorage.key = `creatif-${Credentials.ProjectID()}`;

        localStorage.setItem(StructureStorage.key, JSON.stringify(projectMetadata));
        StructureStorage.instance = new StructureStorage(projectMetadata);
    }
    addList(name: string, structure: Structure) {
        if (this.storage.lists) {
            const existingIdx = this.storage.lists.findIndex((item) => item.name === name);
            if (existingIdx !== -1) {
                this.storage.lists.push(structure);
            }

            this.persist();
        }
    }
    hasList(name: string): boolean {
        if (!this.storage.lists) return false;

        return this.storage.lists.findIndex((item) => item.name === name) !== -1;
    }

    removeVariable(name: string) {
        const locale = Credentials.Locale();
        if (this.storage.variables && this.storage.variables[locale]) {
            const idx = this.storage.variables[locale].findIndex((item) => item.name === name);
            if (idx !== -1) {
                this.storage.variables[locale].splice(idx, 1);
            }
        }
    }
    addVariable(name: string, locale: string, structure: Structure) {
        if (this.storage.variables) {
            if (!this.storage.variables[locale]) {
                this.storage.variables[locale] = [];
            }

            this.storage.variables[locale].push(structure);
        }
    }

    projectName(): string {
        return this.storage.name;
    }

    hasVariable(name: string, locale: string) {
        if (!this.storage.variables) return false;

        if (!this.storage.variables[locale]) return false;

        return this.storage.variables[locale].findIndex((item) => item.name === name) !== -1;
    }

    private persist() {
        localStorage.setItem(StructureStorage.key, JSON.stringify(this.storage));
    }
}
