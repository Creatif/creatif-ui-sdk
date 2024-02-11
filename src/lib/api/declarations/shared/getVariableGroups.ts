import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { GetGroupsBlueprint } from '@root/types/api/shared';
import type { Group } from '@root/types/api/groups';

export default function getVariableGroups(blueprint: GetGroupsBlueprint) {
    return tryHttp<Group[]>(
        declarations(),
        'get',
        `/${blueprint.structureType}/groups/${blueprint.projectId}/${blueprint.structureId}/${blueprint.itemId}`,
        null,
        authHeaders(),
    );
}
