import type { PaginationResult } from '@root/types/api/list';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
import type { PaginateReferencesBlueprint } from '@root/types/api/reference';
export default function paginateReferences<Value = unknown, Metadata = unknown>(
    blueprint: PaginateReferencesBlueprint,
) {
    return tryHttp<PaginationResult<Value, Metadata>>(
        declarations(),
        'get',
        `/references/${blueprint.projectId}/${blueprint.parentId}/${blueprint.childId}/${blueprint.structureType}/${
            blueprint.relationshipType
        }/${blueprint.childStructureId}/${blueprint.parentStructureId}${queryConstructor(
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
