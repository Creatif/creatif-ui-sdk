import LocalesCache from '@lib/storage/localesCache';
import { ApiError } from '@lib/http/apiError';
import { getSupportedLocales } from '@lib/api/project/getSupportedLocales';
import { StructureType } from '@root/types/shell/shell';
import { getStructureMetadata } from '@lib/api/project/getStructureMetadata';
import { createProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import CurrentProjectCache from '@lib/storage/currentProjectCache';
import { getProject } from '@lib/api/project/getProject';
import { Runtime } from '@app/runtime/Runtime';
import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';

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
    const { result, error } = await getStructureMetadata({
        projectId: projectId,
        config: config,
    });

    if (error) return { error: error };

    if (result) {
        createProjectMetadataStore(result.metadata, result.structures);
    }

    return { error: undefined };
}

async function writeCurrentProjectCache(projectId: string): Promise<{ cache?: CurrentProjectCache; error?: ApiError }> {
    if (!CurrentProjectCache.isLoaded()) {
        const { result, error } = await getProject(projectId);

        if (result) {
            return { cache: new CurrentProjectCache(result) };
        }

        return { error: error };
    }

    return { cache: CurrentProjectCache.createInstanceWithExistingCache() };
}

export async function createRuntime(
    projectId: string,
    config: { name: string; type: StructureType }[],
): Promise<ApiError | undefined> {
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
