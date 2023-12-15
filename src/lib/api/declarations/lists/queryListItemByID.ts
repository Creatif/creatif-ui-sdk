import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type { QueriedListItem, QueryListItemByIDBlueprint } from '@root/types/api/list';

export default function queryListItemByID<Value = unknown, Metadata = unknown>(blueprint: QueryListItemByIDBlueprint) {
    return tryGet<QueriedListItem<Value, Metadata>>(
        declarations(),
        `/list/query-id/${Initialize.ProjectID()}/${blueprint.structureId}/${blueprint.itemId}`,
    );
}
