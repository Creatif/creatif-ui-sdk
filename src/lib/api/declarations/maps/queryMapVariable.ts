import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { QueriedMapItem, QueryMapVariableBlueprint } from '@root/types/api/map';

export default function queryMapVariable<Value = unknown, Metadata = unknown>(blueprint: QueryMapVariableBlueprint) {
    return tryHttp<QueriedMapItem<Value, Metadata>>(
        declarations(),
        'get',
        `/map/query-id/${blueprint.projectId}/${blueprint.structureId}/${blueprint.itemId}`,
        null,
    );
}
