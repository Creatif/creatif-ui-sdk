import { create } from 'zustand';
import type { StructureType } from '@root/types/shell/shell';

export interface ConnectionStoreItem {
    name: string;
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
}

export function createInputConnectionStore() {
    return create<ConnectionStore>((set, get) => ({
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
    }));
}
