import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { ProjectMetadata, Structure } from '@lib/api/project/types/ProjectMetadata';
import { Runtime } from '@app/runtime/Runtime';
import type { AppShellItem, StructureType } from '@root/types/shell/shell';

interface StructureItem {
    id: string;
    name: string;
    shortId: string;
    structureType: StructureType;
    createPath: string;
    updatePath: string;
    listPath: string;
    showPath: string;
}

interface OptionsStore {
    metadata: ProjectMetadata;
    getProjectName: () => string;
    getMap: (name: string) => Structure | undefined;
    structureItems: StructureItem[];
}

let store: UseBoundStore<StoreApi<OptionsStore>> | undefined = undefined;

function createStructureItems(metadata: ProjectMetadata, configItems: AppShellItem[]): StructureItem[] {
    const structureItems: StructureItem[] = [];
    for (const configItem of configItems) {
        const structureType = configItem.structureType;
        const structureName = configItem.structureName;

        const metadataItem = metadata.maps.find(item => item.name === structureName);

        if (metadataItem) {
            structureItems.push({
                id: metadataItem.id,
                name: metadataItem.name,
                shortId: metadataItem.shortId,
                structureType: structureType,
                createPath: `${structureType}/create/:id`,
                updatePath: `${structureType}/update/:structureId/:id`,
                listPath: `${structureType}/list`,
                showPath: `${structureType}/show/:structureId/:id`,
            });
        }
    }

    return structureItems;
}

export function createProjectMetadataStore(metadata: ProjectMetadata, configItems: AppShellItem[]) {
    if (store) return store;

    const key = `creatif-${Runtime.instance.credentials.projectId}`;
    if (!Object.keys(localStorage).includes(key)) {
        localStorage.setItem(key, JSON.stringify(metadata));
    }

    store = create<OptionsStore>((_, get) => ({
        metadata: metadata,
        structureItems: createStructureItems(metadata, configItems),
        getProjectName: () => get().metadata.name,
        getMap: (name: string) => get().metadata.maps.find((item) => item.name === name),
    }));

    return store;
}

export function getProjectMetadataStore() {
    if (!store) throw new Error('Store does not exist. This is definitely a bug');

    return store;
}
