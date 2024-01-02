import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import type { CreatedMap, CreateMapBlueprint } from '@root/types/api/map';
export default function createMap(blueprint: CreateMapBlueprint) {
    return tryHttp<CreatedMap>(
        declarations(),
        'put',
        `/map/${blueprint.projectId}`,
        {
            name: blueprint.name,
        },
        authHeaders(),
    );
}
