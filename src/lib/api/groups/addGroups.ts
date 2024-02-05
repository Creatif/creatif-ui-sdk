import { app } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { AddGroupsBlueprint } from '@root/types/api/groups';

export async function addGroups(blueprint: AddGroupsBlueprint) {
    return tryHttp(
        app(),
        'put',
        `/groups/${blueprint.projectId}`,
        {
            groups: blueprint.groups,
        },
        authHeaders(),
    );
}
