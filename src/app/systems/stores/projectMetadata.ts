import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { ProjectMetadata, Structure } from '@lib/api/project/types/ProjectMetadata';
import { Initialize } from '@app/initialize';

interface OptionsStore {
    metadata: ProjectMetadata;
    getProjectName: () => void;
    getMap: (name: string) => Structure | undefined;
}

let store: UseBoundStore<StoreApi<OptionsStore>> | undefined = undefined;

export function createProjectMetadataStore(metadata: ProjectMetadata) {
    if (store) return store;

    const key = `creatif-${Initialize.ProjectID()}`;
    if (!Object.keys(localStorage).includes(key)) {
        localStorage.setItem(key, JSON.stringify(metadata));
    }

    store = create<OptionsStore>((_, get) => ({
        metadata: metadata,
        getProjectName: () => get().metadata.name,
        getMap: (name: string) => get().metadata.maps.find((item) => item.name === name),
    }));

    return store;
}

export function getProjectMetadataStore() {
    if (!store) throw new Error('Store does not exist. This is definitely a bug');

    return store;
}
