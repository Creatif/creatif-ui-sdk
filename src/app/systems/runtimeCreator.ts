import LocalesCache from '@lib/storage/localesCache';
import type { ApiError } from '@lib/http/apiError';
import { getSupportedLocales } from '@lib/api/project/getSupportedLocales';
import type { StructureType } from '@root/types/shell/shell';
import { createProjectMetadataStore, getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import CurrentProjectCache from '@lib/storage/currentProjectCache';
import { Runtime } from '@app/systems/runtime/Runtime';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import { tryHttp } from '@lib/http/tryHttp';
import type { StructureMetadata, Project } from '@root/types/api/project';
import { app } from '@lib/http/fetchInstance';

function removeAppCache(projectId: string) {
    const lsKeys = Object.keys(localStorage);
    const incomingKey = `creatif-${projectId}`;
    // filter out the keys that are not project key
    const possibleAppKeys = lsKeys.filter((item) => new RegExp('creatif-').test(item));
    // if this is a different app key, remove all creatif keys since they will be recreated later
    if (!possibleAppKeys.includes(incomingKey)) {
        console.info('Removing previous app LS keys. They will be recreated.');
        for (const lsKey of lsKeys) {
            if (new RegExp('creatif-').test(lsKey)) {
                localStorage.removeItem(lsKey);
            }
        }
    }
}

async function writeLocalesToCache(): Promise<{ cache?: LocalesCache; error?: ApiError }> {
    if (!LocalesCache.isLoaded()) {
        const { result, error } = await getSupportedLocales();

        if (result) {
            return { cache: new LocalesCache(result) };
        }

        return { error: error };
    }

    return { cache: LocalesCache.createInstanceWithExistingCache() };
}

async function createStructureMetadataStore(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<{ error?: ApiError }> {
    const { result, error } = await tryHttp<StructureMetadata>(app(), 'post', `/project/metadata/${projectId}`, {
        config: config,
    });

    if (error) return { error: error };

    if (result) {
        createProjectMetadataStore(result.metadata, result.diff, result.structures);
    }

    return { error: undefined };
}

async function writeCurrentProjectCache(projectId: string): Promise<{ cache?: CurrentProjectCache; error?: ApiError }> {
    if (!CurrentProjectCache.isLoaded()) {
        const { result, error } = await tryHttp<Project>(app(), 'get', `/project/single/${projectId}`, undefined);

        if (result) {
            return { cache: new CurrentProjectCache(result) };
        }

        return { error: error };
    }

    const currentProject = CurrentProjectCache.createInstanceWithExistingCache();
    if (currentProject.getProject().id !== projectId) {
        const { result, error } = await tryHttp<Project>(app(), 'get', `/project/single/${projectId}`, undefined);

        if (result) {
            return { cache: new CurrentProjectCache(result) };
        }

        return { error: error };
    }

    return { cache: currentProject };
}

export async function createRuntime(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<ApiError | undefined> {
    removeAppCache(projectId);

    const { cache: projectCache, error: projectError } = await writeCurrentProjectCache(projectId);
    if (projectError) return projectError;

    const { cache: localesCache, error: localesError } = await writeLocalesToCache();
    if (localesError) return localesError;

    if (projectCache && localesCache) {
        Runtime.init(new Runtime(projectCache, new CurrentLocaleStorage('eng'), localesCache));
    }

    const { error: metadataStoreError } = await createStructureMetadataStore(projectId, config);
    if (metadataStoreError) return metadataStoreError;
}

export async function updateRuntime(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<ApiError | undefined> {
    removeAppCache(projectId);
    const store = getProjectMetadataStore();

    const { cache: projectCache, error: projectError } = await writeCurrentProjectCache(projectId);
    if (projectError) return projectError;

    const { result, error: metadataError } = await tryHttp<StructureMetadata>(
        app(),
        'post',
        `/project/metadata/${projectId}`,
        {
            config: config,
        },
    );

    if (metadataError) metadataError;

    if (projectCache && result) {
        Runtime.instance.updateProjectCache(projectCache);
        store.getState().replaceMetadata(result.metadata, result.diff, result.structures);
    }
}
