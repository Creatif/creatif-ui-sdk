import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';
import type { ProjectMetadataBlueprint } from '@root/types/api/auth';
export async function getProjectMetadata(blueprint: ProjectMetadataBlueprint) {
    return tryHttp<ProjectMetadata>(app(), 'get', '/project-metadata', undefined, {
        'X-CREATIF-API-KEY': blueprint.apiKey,
        'X-CREATIF-PROJECT-ID': blueprint.projectId,
    });
}
