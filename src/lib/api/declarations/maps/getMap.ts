import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { AppMap, GetMapBlueprint } from '@root/types/api/map';

export default function getMap(blueprint: GetMapBlueprint) {
    return tryHttp<AppMap>(declarations(), 'get', `/map/${blueprint.projectId}/${blueprint.name}`, null);
}
