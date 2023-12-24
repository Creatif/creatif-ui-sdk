import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
interface OptionsStore {
    structureName: string;
    paths: {
        listing: string;
        create: string;
        update: string;
    };
    type: string;
}
interface Props {
    structureName: string;
    path: string;
    type: string;
}

const store: Record<string, UseBoundStore<StoreApi<OptionsStore>>> = {};
export function createOptions({ structureName, path, type }: Props) {
    const name = `${structureName}-options`;

    if (store[name]) throw new Error(`Store with name '${name}' already exists. This is definitely a bug.`);

    store[name] = create<OptionsStore>(() => ({
        paths: {
            listing: `/${path}`,
            create: `/${path}/create`,
            update: `/${path}/update`,
        },
        type: type,
        structureName: name,
    }));
}

export function getOptions(structureName: string) {
    const name = `${structureName}-options`;

    if (!store[name])
        return {
            store: null,
            error: {
                message: `Structure name <strong>${structureName}</strong> does not seem to exist. Did you perhaps misspell the name of the structure when you created your create/update form component?`,
            },
        };

    return { store: store[name], error: null };
}
