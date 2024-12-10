import type { PaginateListBlueprint, PaginationResult } from '@root/types/api/list';
import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
export default function paginateListVariables<Value = unknown, Metadata = unknown>(blueprint: PaginateListBlueprint) {
    return tryHttp<PaginationResult<Value, Metadata>>(
        declarations(),
        'get',
        `/lists/items/${blueprint.projectId}/${blueprint.name}${queryConstructor(
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
    );
}
