import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

export interface ImagePathsStoreData {
    paths: string[];
    updatedPaths: string[];
    addPath: (path: string) => string | undefined;
    addUpdatedPath: (path: string) => string | undefined;
    removePath: (toRemove: string) => void;
}

export type ImagePathsStore = UseBoundStore<StoreApi<ImagePathsStoreData>>;

export function createImagePathsStore() {
    return create<ImagePathsStoreData>((set, get) => ({
        paths: [],
        updatedPaths: [],
        addUpdatedPath(path: string) {
            const current = get();
            if (current.updatedPaths.includes(path)) {
                return 'File path exists';
            }

            current.updatedPaths.push(path);
            set((current) => ({ ...current }));
        },
        addPath(path: string) {
            const current = get();
            if (current.paths.includes(path)) {
                return 'File path exists';
            }

            current.paths.push(path);
            set((current) => ({ ...current }));
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
