import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { ProjectMetadata, Structure } from '@lib/api/project/types/ProjectMetadata';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { StructureType } from '@root/types/shell/shell';
import type { StructureDiff} from '@root/types/api/project';
import { StructureMetadata } from '@root/types/api/project';

export interface IncomingStructureItem {
    id: string;
    shortId: string;
    name: string;
    structureType: StructureType;
}

export interface StructureItem {
    id: string;
    name: string;
    shortId: string;
    structureType: StructureType;
    createPath: string;
    updatePath: string;
    listPath: string;
    showPath: string;

    navigationListPath: string;
    navigationUpdatePath: string;
    navigationCreatePath: string;
    navigationShowPath: string;
}

interface OptionsStore {
    metadata: ProjectMetadata;
    diff: StructureDiff;
    getProjectName: () => string;
    getMap: (name: string) => Structure | undefined;
    getList: (name: string) => Structure | undefined;
    getStructureItemByID: (id: string) => StructureItem | undefined;
    getStructureItemByName: (name: string, type: StructureType) => StructureItem | undefined;
    structureItems: StructureItem[];
    existsInConfig: (id: string, structureType: StructureType) => boolean;
}

let store: UseBoundStore<StoreApi<OptionsStore>> | undefined = undefined;

function createStructureItems(incomingStructureItems: IncomingStructureItem[]): StructureItem[] {
    const structureItems: StructureItem[] = [];
    for (const structureItem of incomingStructureItems) {
        const structureType = structureItem.structureType;
        const structureName = structureItem.name;

        structureItems.push({
            id: structureItem.id,
            name: structureItem.name,
            shortId: structureItem.shortId,
            structureType: structureType,
            createPath: `:structureType/${structureName}/create/:structureId`,
            updatePath: `:structureType/${structureName}/update/:structureId/:itemId`,
            listPath: `:structureType/${structureName}/list/:structureId`,
            showPath: `:structureType/${structureName}/show/:structureId/:itemId`,

            navigationUpdatePath: `${Runtime.instance.rootPath()}/${structureType}/${structureName}/update`,
            navigationListPath: `${Runtime.instance.rootPath()}/${structureType}/${structureName}/list`,
            navigationCreatePath: `${Runtime.instance.rootPath()}/${structureType}/${structureName}/create`,
            navigationShowPath: `${Runtime.instance.rootPath()}/${structureType}/${structureName}/show`,
        });
    }

    return structureItems;
}

export function createProjectMetadataStore(
    metadata: ProjectMetadata,
    diff: StructureDiff,
    incomingStructureItems: IncomingStructureItem[],
) {
    if (store) return store;

    const key = `creatif-${Runtime.instance.currentProjectCache.getProject().id}`;
    if (!Object.keys(localStorage).includes(key)) {
        localStorage.setItem(key, JSON.stringify(metadata));
    }

    store = create<OptionsStore>((_, get) => ({
        metadata: metadata,
        diff: diff,
        existsInConfig: (id: string, structureType: StructureType) => {
            const store = get();

            if (structureType === 'list') {
                const found = store.diff.lists.find((t) => t.id === id);

                return !found;
            }

            if (structureType === 'map') {
                const found = store.diff.maps.find((t) => t.id === id);

                return !found;
            }

            return false;
        },
        structureItems: createStructureItems(incomingStructureItems),
        getProjectName: () => get().metadata.name,
        getMap: (name: string) => get().metadata.maps.find((item) => item.name === name),
        getList: (name: string) => get().metadata.lists.find((item) => item.name === name),
        getStructureItemByID: (id: string) => get().structureItems.find((t) => t.id === id),
        getStructureItemByName: (name: string, type: StructureType) =>
            get().structureItems.find((t) => t.name === name && t.structureType === type),
    }));

    return store;
}

export function getProjectMetadataStore() {
    if (!store) throw new Error('Store does not exist. This is definitely a bug');

    return store;
}
