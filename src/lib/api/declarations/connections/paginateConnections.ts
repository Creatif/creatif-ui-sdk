import type { PaginationResult } from '@root/types/api/list';
import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
import type { PaginateConnectionsBlueprint } from '@root/types/api/connections';
export default function paginateConnections<Value = unknown, Metadata = unknown>(
    blueprint: PaginateConnectionsBlueprint,
) {
    return tryHttp<PaginationResult<Value, Metadata>>(
        declarations(),
        'get',
        `/connections/${blueprint.projectId}/${blueprint.structureId}/${blueprint.structureType}/${
            blueprint.parentVariableId
        }${queryConstructor(
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
