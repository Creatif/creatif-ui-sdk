import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { QueriedListItem, QueryListItemByIDBlueprint } from '@root/types/api/list';

export default function queryListItemByID<Value = unknown, Metadata = unknown>(blueprint: QueryListItemByIDBlueprint) {
    return tryHttp<QueriedListItem<Value, Metadata>>(
        declarations(),
        'get',
        `/list/quey-id/${Initialize.ProjectID()}/${blueprint.structureId}/${blueprint.itemId}`,
    );
}
