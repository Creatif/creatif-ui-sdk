import { create } from 'zustand';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { StructureType } from '@root/types/shell/shell';

interface StoreStructure {
    structureName: string;
    structureType: StructureType;
}
interface AppConfigStore {
    structures: StoreStructure[];
    exists: (structureName: string, structureType: StructureType) => boolean;
}
interface Props {
    structures: StoreStructure[];
}

const store: Record<string, UseBoundStore<StoreApi<AppConfigStore>>> = {};
export function createAppConfigStore({ structures }: Props) {
    const name = 'app_config';

    if (store[name]) throw new Error(`Store with name '${name}' already exists. This is definitely a bug.`);

    store[name] = create<AppConfigStore>((_, get) => ({
        structures: structures,
        exists: (structureName, structureType) =>
            get().structures.some(
                (item) => item.structureName === structureName && item.structureType === structureType,
            ),
    }));
}

export function getAppConfigStore() {
    const name = 'app_config';

    if (!store[name]) {
        throw new Error(`Store with name '${name}' does not exist. This is definitely a bug.`);
    }

    return store[name];
}
