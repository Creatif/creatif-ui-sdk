import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

export interface GlobalLoadingStoreData {
    loaders: number;
    addLoader: () => void;
    removeLoader: () => void;
}

export type GlobalLoadingStore = UseBoundStore<StoreApi<GlobalLoadingStoreData>>;

export function createGlobalLoadingStore() {
    return create<GlobalLoadingStoreData>((set) => ({
        loaders: 0,
        addLoader() {
            set((current) => ({ ...current, loaders: current.loaders + 1 }));
        },
        removeLoader() {
            set((current) => ({ ...current, loaders: current.loaders - 1 }));
        },
    }));
}
