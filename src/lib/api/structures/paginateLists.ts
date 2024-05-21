import type { PaginateListStructureBlueprint, PaginationResult } from '@root/types/api/list';
import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/structures/queryConstructor';
export default function paginateLists<Value = unknown, Metadata = unknown>(blueprint: PaginateListStructureBlueprint) {
    return tryHttp<PaginationResult<Value, Metadata>>(
        declarations(),
        'get',
        `/lists/${blueprint.projectId}${queryConstructor(
            blueprint.page,
            blueprint.limit as string,
            blueprint.orderBy,
            blueprint.direction,
            blueprint.search,
        )}`,
        null,
    );
}
