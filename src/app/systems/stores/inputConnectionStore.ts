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
    references: ConnectionStoreItem[];
    add: (item: ConnectionStoreItem) => void;
    get: (name: string) => ConnectionStoreItem | undefined;
    assign: (references: ConnectionStoreItem[]) => void;
    has: (name: string) => boolean;
    keys: () => string[];
    all: () => ConnectionStoreItem[];
    update: (ref: ConnectionStoreItem) => void;
    reset: () => void;
}

export type Store = UseBoundStore<StoreApi<ConnectionStore>>;

let store: Store;

export function createInputConnectionStore() {
    if (store) return store;

    const createdStore = create<ConnectionStore>((set, get) => ({
        references: [],
        add: (item: ConnectionStoreItem) =>
            set((current) => ({ ...current, references: [...current.references, item] })),
        keys: () => get().references.map((item) => item.path),
        all: () => get().references,
        get: (name: string) => {
            const store = get();
            const references = store.references;
            return references.find((item) => item.path === name);
        },
        assign: (refs: ConnectionStoreItem[]) => set((current) => ({ ...current, references: refs })),
        has: (name: string) => {
            const store = get();
            return Boolean(store.references.find((item) => item.path === name));
        },
        update: (ref: ConnectionStoreItem) =>
            set((current) => {
                const store = get();
                const idx = store.references.findIndex((item) => item.path === ref.path);
                if (idx !== -1) {
                    const refs = [...store.references];
                    refs.splice(idx, 1);
                    refs.push(ref);

                    return { ...current, references: [...refs] };
                }

                return store;
            }),
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
