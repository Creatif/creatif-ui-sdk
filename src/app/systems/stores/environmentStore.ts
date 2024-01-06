import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { Environment } from '@root/types/devBar/environment';
export interface EnvironmentStore {
    environment: Environment;
    changeEnvironment: (env: Environment) => void;
}

let store: UseBoundStore<StoreApi<EnvironmentStore>>;
export function getEnvironmentStore() {
    const key = 'creatif-environment';
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, 'dev');
    }

    if (store) return store;
    store = create<EnvironmentStore>((set) => ({
        environment: localStorage.getItem(key) as Environment,
        changeEnvironment: (env: Environment) =>
            set(() => {
                localStorage.setItem(key, env);
                return {
                    environment: localStorage.getItem(key) as Environment,
                };
            }),
    }));

    return store;
}
