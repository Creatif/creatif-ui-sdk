import { app } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { GetGroupsBlueprint } from '@root/types/api/groups';

export async function getGroups(blueprint: GetGroupsBlueprint) {
    return tryHttp(
        app(),
        'get',
        `/groups/${blueprint.projectId}`,
        null,
        authHeaders(),
    );
}
