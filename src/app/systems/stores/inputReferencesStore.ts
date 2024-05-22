import { create } from 'zustand';
import type { StructureType } from '@root/types/shell/shell';

export interface ReferenceStoreItem {
    name: string;
    parentType: StructureType;
    childType: StructureType;
    parentId: string;
    childId: string;
    parentStructureId: string;
    childStructureId: string;
    structureName: string;
    structureType: string;
    variableId: string;
}
export interface ReferencesStore {
    locked: boolean;
    references: ReferenceStoreItem[];
    add: (item: ReferenceStoreItem) => void;
    get: (name: string) => ReferenceStoreItem | undefined;
    assign: (references: ReferenceStoreItem[]) => void;
    has: (name: string) => boolean;
    keys: () => string[];
    unlock: () => void;
    all: () => ReferenceStoreItem[];
    update: (ref: ReferenceStoreItem) => void;
}

export function createInputReferenceStore() {
    return create<ReferencesStore>((set, get) => ({
        references: [],
        locked: true,
        unlock: () => {
            set((current) => ({ ...current, locked: false }));
        },
        add: (item: ReferenceStoreItem) =>
            set((current) => ({ ...current, references: [...current.references, item] })),
        keys: () => get().references.map((item) => item.name),
        all: () => get().references,
        get: (name: string) => {
            const store = get();
            const references = store.references;
            return references.find((item) => item.name === name);
        },
        assign: (refs: ReferenceStoreItem[]) => set((current) => ({ ...current, references: refs })),
        has: (name: string) => {
            const store = get();
            return Boolean(store.references.find((item) => item.name === name));
        },
        update: (ref: ReferenceStoreItem) =>
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
