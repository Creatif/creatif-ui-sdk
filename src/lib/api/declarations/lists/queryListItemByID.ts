import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type {
	QueriedListItem,
	QueryListItemByIDBlueprint,
} from '@lib/api/declarations/types/listTypes';

export default function queryListItemByID<Value = unknown, Metadata = unknown>(
	blueprint: QueryListItemByIDBlueprint,
) {
	return tryGet<QueriedListItem<Value, Metadata>>(
		declarations(),
		`/list/query-id/${Initialize.ProjectID()}/${
			blueprint.locale ? blueprint.locale : Initialize.Locale()
		}/${blueprint.structureId}/${blueprint.itemId}`,
	);
}
