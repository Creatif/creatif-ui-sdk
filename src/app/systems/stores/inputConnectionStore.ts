import type { UseBoundStore } from 'zustand';
import { create } from 'zustand';
import type { StructureType } from '@root/types/shell/shell';
import type { StoreApi } from 'zustand/esm';

export interface ConnectionStoreItem {
    name: string;
    path: string;
    structureType: StructureType;
    variableId: string;
}

export interface ConnectionStore {
    locked: boolean;
    references: ConnectionStoreItem[];
    add: (item: ConnectionStoreItem) => void;
    get: (name: string) => ConnectionStoreItem | undefined;
    assign: (references: ConnectionStoreItem[]) => void;
    has: (name: string) => boolean;
    keys: () => string[];
    unlock: () => void;
    all: () => ConnectionStoreItem[];
    update: (ref: ConnectionStoreItem) => void;
    reset: () => void;
    remove: (name: string) => void;
}

export type Store = UseBoundStore<StoreApi<ConnectionStore>>;

let store: Store;

export function createInputConnectionStore() {
    if (store) return store;

    const createdStore = create<ConnectionStore>((set, get) => ({
        references: [],
        locked: true,
        unlock: () => {
            set((current) => ({ ...current, locked: false }));
        },
        add: (item: ConnectionStoreItem) =>
            set((current) => ({ ...current, references: [...current.references, item] })),
        keys: () => get().references.map((item) => item.name),
        all: () => get().references,
        get: (name: string) => {
            const store = get();
            const references = store.references;
            return references.find((item) => item.name === name);
        },
        assign: (refs: ConnectionStoreItem[]) => set((current) => ({ ...current, references: refs })),
        has: (name: string) => {
            const store = get();
            return Boolean(store.references.find((item) => item.name === name));
        },
        update: (ref: ConnectionStoreItem) =>
            set((current) => {
                const store = get();
                const idx = store.references.findIndex((item) => item.name === ref.name);
                if (idx !== -1) {
                    const refs = [...store.references];
                    refs.splice(idx, 1);
                    refs.push(ref);

                    return { ...current, references: [...refs] };
                }

                return store;
            }),
        remove: (name: string) => {
            const connections = get().references;
            console.info('old connections: ', name, connections);
            const newConnections: ConnectionStoreItem[] = [];
            for (const item of connections) {
                if (item.name !== name) {
                    newConnections.push(item);
                }
            }

            for (let i = 0; i < newConnections.length; i++) {
                const conn = newConnections[i];
                const parts = conn.name.split('.');
                if (parts.length > 0) {
                    conn.name = `${parts[0]}.${i}.${parts[2]}`;
                }
            }

            console.info('new connections: ', newConnections);

            set((current) => ({ ...current, references: newConnections }));
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
