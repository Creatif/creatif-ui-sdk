import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { GetGroupsBlueprint, Group } from '@root/types/api/groups';

export async function getGroups(blueprint: GetGroupsBlueprint) {
    return tryHttp<Group[]>(app(), 'get', `/groups/${blueprint.projectId}`, null);
}
