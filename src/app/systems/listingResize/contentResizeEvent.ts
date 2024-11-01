import type { StoreApi, UseBoundStore } from 'zustand';
import { create } from 'zustand';

export interface GlobalLoadingStoreData {
    size: number;
    setSize: (size: number) => void;
}

export type ContentResizeEventStore = UseBoundStore<StoreApi<GlobalLoadingStoreData>>;

let store: ContentResizeEventStore;

export function createContentResizeEvent(initialSize: number): ContentResizeEventStore {
    if (store) {
        return store;
    }

    store = create<GlobalLoadingStoreData>((set) => ({
        size: initialSize,
        setSize(size: number) {
            set((current) => ({ ...current, size: size }));
        },
    }));

    return store;
}
