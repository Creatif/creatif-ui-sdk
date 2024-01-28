import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { AddToListBlueprint } from '@root/types/api/list';

export async function addToList(blueprint: AddToListBlueprint) {
    return tryHttp(
        declarations(),
        'put',
        `/list/add/${blueprint.projectId}`,
        {
            name: blueprint.name,
            variable: blueprint.variable,
        },
        authHeaders(),
    );
}
