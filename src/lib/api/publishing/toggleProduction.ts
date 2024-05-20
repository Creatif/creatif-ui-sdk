import { publishing } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { ToggleProductionBlueprint } from '@root/types/api/publishing';

export async function toggleProduction(blueprint: ToggleProductionBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(publishing(), 'post', `/publish/toggle-production/${blueprint.projectId}/${blueprint.id}`, null),
    );
}
