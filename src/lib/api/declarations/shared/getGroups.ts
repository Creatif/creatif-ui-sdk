import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { GetGroupsBlueprint } from '@root/types/api/shared';

export default function getGroups(blueprint: GetGroupsBlueprint) {
    return tryHttp<string[]>(
        declarations(),
        'get',
        `/${blueprint.structureType}/groups/${blueprint.projectId}/${blueprint.structureId}`,
        null,
        authHeaders(),
    );
}