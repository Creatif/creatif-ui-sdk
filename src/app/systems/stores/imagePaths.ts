import { create, StoreApi, UseBoundStore } from 'zustand';

export interface ImagePathsStoreData {
    paths: string[];
    addPath: (path: string) => void;
    removePath: (toRemove: string) => void;
}

export type ImagePathsStore = UseBoundStore<StoreApi<ImagePathsStoreData>>;

export function createImagePathsStore() {
    return create<ImagePathsStoreData>((set, get) => ({
        paths: [],
        addPath(path: string) {
            const current = get();
            if (current.paths.includes(path)) return;

            current.paths.push(path);

            return { ...current };
        },
        removePath(toRemove: string) {
            const current = get();
            const idx = current.paths.findIndex((path) => path === toRemove);
            if (idx !== -1) {
                current.paths.splice(idx, 1);
                set((current) => ({ ...current }));
            }
        },
        clear() {
            set((current) => ({ ...current, paths: [] }));
        },
    }));
}
