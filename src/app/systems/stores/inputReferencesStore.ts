import { create } from 'zustand';

export interface ReferenceStoreItem {
    name: string;
    structureName: string;
    structureType: string;
    variableId: string;
}
export interface ReferencesStore {
    references: ReferenceStoreItem[];
    add: (item: ReferenceStoreItem) => void;
    get: (name: string) => ReferenceStoreItem | undefined;
    assign: (references: ReferenceStoreItem[]) => void;
    has: (name: string) => boolean;
    keys: () => string[];
    all: () => ReferenceStoreItem[];
    update: (ref: ReferenceStoreItem) => void;
}

export function createInputReferenceStore() {
    return create<ReferencesStore>((set, get) => ({
        references: [],
        add: (item: ReferenceStoreItem) => set(({ references }) => ({ references: [...references, item] })),
        keys: () => get().references.map((item) => item.name),
        all: () => get().references,
        get: (name: string) => {
            const store = get();
            const references = store.references;
            return references.find((item) => item.name === name);
        },
        assign: (refs: ReferenceStoreItem[]) => set(() => ({ references: refs })),
        has: (name: string) => {
            const store = get();
            return Boolean(store.references.find((item) => item.name === name));
        },
        update: (ref: ReferenceStoreItem) =>
            set(() => {
                const store = get();
                const idx = store.references.findIndex((item) => item.name === ref.name);
                if (idx !== -1) {
                    const refs = [...store.references];
                    refs.splice(idx, 1);
                    refs.push(ref);
                    return { references: [...refs] };
                }

                return store;
            }),
    }));
}
