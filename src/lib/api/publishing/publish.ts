import { publishing } from '@lib/http/fetchInstance';
import { authHeaders, throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { PublishBlueprint } from '@root/types/api/publishing';

export async function publish(blueprint: PublishBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(
            publishing(),
            'put',
            `/publish/${blueprint.projectId}`,
            {
                name: blueprint.name,
            },
            authHeaders(),
        ),
    );
}
