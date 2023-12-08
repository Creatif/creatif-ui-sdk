import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
import type {
	UpdateListItemBlueprint,
	UpdateListItemResult,
} from '@lib/api/declarations/types/listTypes';
export async function updateListItem(blueprint: UpdateListItemBlueprint) {
	return tryPost<UpdateListItemResult>(
		declarations(),
		`/list/update-item-by-id/${Initialize.ProjectID()}/${
			blueprint.locale ? blueprint.locale : Initialize.Locale()
		}/${blueprint.name}/${
			blueprint.itemID
		}?fields=name|metadata|groups|behaviour|value`,
		{
			values: {
				name: blueprint.variable.name,
				groups: blueprint.variable.groups,
				behaviour: blueprint.variable.behaviour,
				value: blueprint.variable.value
					? JSON.stringify(blueprint.variable.value)
					: null,
				metadata: blueprint.variable.metadata
					? JSON.stringify(blueprint.variable.metadata)
					: null,
			},
		},
	);
}
