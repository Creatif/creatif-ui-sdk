import type { UseBoundStore } from 'zustand';
import { create } from 'zustand';
import type { StructureType } from '@root/types/shell/shell';
import type { StoreApi } from 'zustand/esm';

export interface ConnectionStoreItem {
    path: string;
    structureType: StructureType;
    variableId: string;
}

export interface ConnectionStore {
    connections: ConnectionStoreItem[];
    add: (item: ConnectionStoreItem) => void;
    get: (name: string) => ConnectionStoreItem | undefined;
    assign: (references: ConnectionStoreItem[]) => void;
    has: (name: string) => boolean;
    keys: () => string[];
    all: () => ConnectionStoreItem[];
    reset: () => void;
}

export type Store = UseBoundStore<StoreApi<ConnectionStore>>;

let store: Store;

export function createInputConnectionStore() {
    if (store) return store;

    const createdStore = create<ConnectionStore>((set, get) => ({
        connections: [],
        add: (item: ConnectionStoreItem) =>
            set((current) => ({ ...current, connections: [...current.connections, item] })),
        keys: () => get().connections.map((item) => item.path),
        all: () => get().connections,
        get: (name: string) => {
            const store = get();
            const references = store.connections;
            return references.find((item) => item.path === name);
        },
        assign: (refs: ConnectionStoreItem[]) => set((current) => ({ ...current, connections: refs })),
        has: (name: string) => {
            const store = get();
            return Boolean(store.connections.find((item) => item.path === name));
        },
        reset: () => {
            set((current) => ({
                ...current,
                ...{
                    references: [],
                    locked: true,
                },
            }));
        },
    }));

    if (!store) {
        store = createdStore;
    }

    return store;
}

export function useConnectionStore(): Store {
    if (!store) throw new Error('Internal error. Connection store should exists');

    return store;
}
