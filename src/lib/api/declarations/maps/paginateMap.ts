import type { PaginatedVariableResult } from '@root/types/api/list';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
import type { PaginateMapBlueprint } from '@root/types/api/map';
export default function paginateMap<Value = unknown, Metadata = unknown>(blueprint: PaginateMapBlueprint) {
    return tryHttp<PaginatedVariableResult<Value, Metadata>>(
        declarations(),
        'get',
        `/maps/items/${blueprint.projectId}/${blueprint.name}${queryConstructor(
            blueprint.page,
            blueprint.limit as string,
            blueprint.groups,
            blueprint.orderBy,
            blueprint.direction,
            blueprint.search,
            blueprint.behaviour,
            blueprint.locales,
            blueprint.fields,
        )}`,
        null,
        authHeaders(),
    );
}
