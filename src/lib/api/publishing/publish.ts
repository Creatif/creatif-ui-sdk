import { publishing } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { PublishBlueprint } from '@root/types/api/publishing';

export async function publish(blueprint: PublishBlueprint) {
    return tryHttp(
        publishing(),
        'put',
        `/publish/${blueprint.projectId}`,
        null,
        authHeaders(),
    );
}
