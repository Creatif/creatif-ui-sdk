import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { TruncateStructureBlueprint } from '@root/types/api/publishing';

export async function removeStructure(blueprint: TruncateStructureBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(app(), 'post', `/project/structure/remove/${blueprint.projectId}`, {
            id: blueprint.id,
            type: blueprint.type,
        }),
    );
}
