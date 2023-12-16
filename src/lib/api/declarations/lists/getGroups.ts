import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import type { GetGroupsBlueprint } from '@root/types/api/list';
export default function getGroups(blueprint: GetGroupsBlueprint) {
    return tryHttp<string[], { name: string }>(
        declarations(),
        'post',
        `/list/groups/${blueprint.projectId}`,
        {
            name: blueprint.name,
        },
        authHeaders(),
    );
}
