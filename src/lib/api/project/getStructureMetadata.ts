import type { GetStructureMetadataBlueprint, Project, StructureMetadata } from '@root/types/api/project';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import { app } from '@lib/http/fetchInstance';

export function getStructureMetadata(blueprint: GetStructureMetadataBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp<StructureMetadata>(app(), 'post', `/project/metadata/${blueprint.projectId}`, {
            config: blueprint.config,
        }),
    );
}
