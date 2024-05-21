import type { PaginateMapStructureBlueprint, PaginationResult } from '@root/types/api/list';
import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/structures/queryConstructor';
export default function paginateMaps<Value = unknown, Metadata = unknown>(blueprint: PaginateMapStructureBlueprint) {
    return tryHttp<PaginationResult<Value, Metadata>>(
        declarations(),
        'get',
        `/maps/${blueprint.projectId}${queryConstructor(
            blueprint.page,
            blueprint.limit as string,
            blueprint.orderBy,
            blueprint.direction,
            blueprint.search,
        )}`,
        null,
    );
}
