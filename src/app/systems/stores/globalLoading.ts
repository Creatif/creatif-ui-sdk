import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

export interface GlobalLoadingStoreData {
    loaders: number;
    addLoader: () => void;
    removeLoader: () => void;
    isLoading: () => boolean;
}

export type GlobalLoadingStore = UseBoundStore<StoreApi<GlobalLoadingStoreData>>;

export function createGlobalLoadingStore() {
    return create<GlobalLoadingStoreData>((set, get) => ({
        loaders: 0,
        addLoader() {
            set((current) => ({ ...current, loaders: current.loaders + 1 }));
        },
        removeLoader() {
            set((current) => ({ ...current, loaders: current.loaders - 1 }));
        },
        isLoading() {
            console.log(get().loaders);
            return get().loaders !== 0;
        },
    }));
}
