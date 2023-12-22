import type { PaginatedVariableResult, PaginateListBlueprint } from '@root/types/api/list';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
export default function paginateVariables<Value = unknown, Metadata = unknown>(blueprint: PaginateListBlueprint) {
    return tryHttp<PaginatedVariableResult<Value, Metadata>>(
        declarations(),
        'get',
        `/variables/${blueprint.projectId}${queryConstructor(
            blueprint.page,
            blueprint.limit as string,
            blueprint.groups,
            blueprint.orderBy,
            blueprint.direction,
            blueprint.search,
            blueprint.behaviour,
            blueprint.locales,
        )}`,
        null,
        authHeaders(),
    );
}