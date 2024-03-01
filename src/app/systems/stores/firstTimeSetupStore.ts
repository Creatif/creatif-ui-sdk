import { create, type StoreApi, type UseBoundStore } from 'zustand';
import type { AppShellItem } from '@root/types/shell/shell';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
import createList from '@lib/api/declarations/lists/createList';
import { Runtime } from '@app/runtime/Runtime';
import createMap from '@lib/api/declarations/maps/createMap';
import type { CreatedList } from '@root/types/api/list';
import type { CreatedMap } from '@root/types/api/map';
import type { ApiError } from '@lib/http/apiError';
import { createVariable } from '@lib/api/declarations/variables/createVariable';
import type { CreatedVariable } from '@root/types/api/variable';

type RunBlueprint = {
    name: string;
    fn: typeof createListFn | typeof createMapFn;
};

type RunResult = {
    key: 'list' | 'map';
    result: CreatedList | CreatedMap | CreatedVariable | undefined;
    error: ApiError | undefined;
};

interface FirstTimeSetupStore {
    projectMetadata: ProjectMetadata;
    configItems: Pick<AppShellItem, 'structureType' | 'structureName'>[];
    currentStage: 'setup' | 'creatingStructures' | 'error' | 'finished';
    runBlueprints: RunBlueprint[];
    createdStructures: RunResult[];
    startSetup: () => void;
    run: () => void;
    close: () => void;
}

interface Props {
    projectMetadata: ProjectMetadata;
    configItems: Pick<AppShellItem, 'structureType' | 'structureName'>[];
}

async function createListFn(name: string): Promise<RunResult> {
    const { result, error } = await createList({
        name: name,
        projectId: Runtime.instance.credentials.projectId,
    });

    return {
        key: 'list',
        result: result,
        error: error,
    };
}

async function createVariableFn(name: string): Promise<RunResult> {
    const { result, error } = await createVariable({
        name: name,
        projectId: Runtime.instance.credentials.projectId,
        locale: 'eng',
    });

    return {
        key: 'list',
        result: result,
        error: error,
    };
}

async function createMapFn(name: string): Promise<RunResult> {
    const { result, error } = await createMap({
        name: name,
        projectId: Runtime.instance.credentials.projectId,
    });

    return {
        key: 'map',
        result: result,
        error: error,
    };
}

let store: UseBoundStore<StoreApi<FirstTimeSetupStore>> | undefined = undefined;

export function createFirstTimeSetupStore({ projectMetadata, configItems }: Props) {
    if (store) return store;

    store = create<FirstTimeSetupStore>((set, get) => ({
        projectMetadata: projectMetadata,
        runBlueprints: [],
        configItems: configItems,
        currentStage: 'setup',
        createdStructures: [],
        startSetup() {
            const currentStore = get();

            // 1. if it exists in project metadata, it is already created -> skip
            // 2. if it does not exist in project metadata, it must be created -> run
            for (const configItem of currentStore.configItems) {
                const maps = currentStore.projectMetadata.maps;
                const lists = currentStore.projectMetadata.lists;

                if (configItem.structureType === 'list') {
                    const foundItem = lists.find(
                        (t) => t.name === configItem.structureName && configItem.structureType === 'list',
                    );

                    if (!foundItem) {
                        set((current) => ({
                            ...current,
                            runBlueprints: [
                                ...current.runBlueprints,
                                {
                                    name: configItem.structureName,
                                    fn: createListFn,
                                },
                            ],
                        }));
                    }
                }

                if (configItem.structureType === 'map') {
                    const foundItem = maps.find((t) => t.name === configItem.structureName);

                    if (!foundItem) {
                        set((current) => ({
                            ...current,
                            runBlueprints: [
                                ...current.runBlueprints,
                                {
                                    name: configItem.structureName,
                                    fn: createMapFn,
                                },
                            ],
                        }));
                    }
                }

                set((current) => ({ ...current, currentStage: 'creatingStructures' }));
            }
        },
        run() {
            const { runBlueprints } = get();

            if (runBlueprints.length !== 0) {
                const promises = Promise.all(runBlueprints.map((item) => item.fn(item.name)));

                promises.then((results) => {
                    const isError = results.find((res) => res.error);
                    if (isError) {
                        set((current) => ({ ...current, currentStage: 'error' }));
                        return;
                    }

                    set((current) => ({ ...current, currentStage: 'finished', createdStructures: results }));
                });

                return;
            }

            set((current) => ({ ...current, currentStage: 'finished' }));
        },
        close() {
            set(() => ({
                projectMetadata: undefined,
                runBlueprints: [],
                configItems: undefined,
                createdStructures: [],
            }));
        },
    }));
}

export function getFirstTimeSetupStore(): UseBoundStore<StoreApi<FirstTimeSetupStore>> {
    return store as UseBoundStore<StoreApi<FirstTimeSetupStore>>;
}
