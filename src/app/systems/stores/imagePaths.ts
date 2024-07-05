import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

export interface ImagePathsStoreData {
    paths: string[];
    addPath: (path: string) => string | undefined;
    replacePath: (oldValue: string, newValue: string) => void;
    removePath: (toRemove: string) => void;
}

export type ImagePathsStore = UseBoundStore<StoreApi<ImagePathsStoreData>>;

export function createImagePathsStore() {
    return create<ImagePathsStoreData>((set, get) => ({
        paths: [],
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
            const newPaths: string[] = [];
            //console.log('Current: ', toRemove, current.paths);
            for (const curr of current.paths) {
                if (curr !== toRemove) {
                    newPaths.push(curr);
                }
            }

            console.log('New paths: ', newPaths);

            set((current) => ({ ...current, paths: newPaths }));
        },
        replacePath(old: string, newValue: string) {
            const currentPaths = [...get().paths];
            for (let i = 0; i < currentPaths.length; i++) {
                if (currentPaths[i] === old) {
                    currentPaths[i] = newValue;
                }
            }

            console.log('Replaced paths: ', currentPaths);

            set((current) => ({ ...current, paths: currentPaths }));
        },
        clear() {
            set((current) => ({ ...current, paths: [] }));
        },
    }));
}
