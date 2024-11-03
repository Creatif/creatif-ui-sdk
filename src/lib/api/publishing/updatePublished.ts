import { publishing } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { UpdatePublishedBlueprint } from '@root/types/api/publishing';

export async function updatePublished(blueprint: UpdatePublishedBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(publishing(), 'post', `/publish/${blueprint.projectId}`, {
            name: blueprint.name,
        }),
    );
}
