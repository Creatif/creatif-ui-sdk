import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Environment } from '@root/types/devBar/environment';
export interface EnvironmentStore {
    environment: Environment;
    changeEnvironment: (env: Environment) => void;
}

let store: UseBoundStore<StoreApi<EnvironmentStore>>;
export function getEnvironmentStore() {
    if (store) return store;
    store = create<EnvironmentStore>((set) => ({
        environment: 'dev',
        changeEnvironment: (env: Environment) => set(() => ({ environment: env })),
    }));

    return store;
}
