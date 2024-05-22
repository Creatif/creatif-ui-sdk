import { publishing } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { RemoveVersionBlueprint } from '@root/types/api/publishing';

export async function removeVersion(blueprint: RemoveVersionBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(publishing(), 'delete', `/publish/version/${blueprint.projectId}/${blueprint.id}`, null),
    );
}
