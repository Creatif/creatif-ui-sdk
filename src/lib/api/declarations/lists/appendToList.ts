import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import {tryPut} from '@lib/http/tryPut';
import type {AppendToListBlueprint} from '@lib/api/declarations/listTypes';
export async function appendToList(blueprint: AppendToListBlueprint) {
	return tryPut(
		declarations(),
		`/list/append/${Initialize.ProjectID()}/${
			blueprint.locale ? blueprint.locale : Initialize.Locale()
		}`,
		{
			name: blueprint.name,
			variables: blueprint.variables.map((item) => {
				if (item.value) {
					item.value = JSON.stringify(item.value);
				}

				if (item.metadata) {
					item.metadata = JSON.stringify(item.metadata);
				}

				return item;
			}),
		},
	);
}
