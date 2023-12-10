import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type { AppendedListResult, AppendToListBlueprint } from '@lib/api/declarations/types/listTypes';
export async function appendToList(blueprint: AppendToListBlueprint) {
	return tryPut<AppendedListResult>(
		declarations(),
		`/list/append/${Initialize.ProjectID()}`,
		{
			name: blueprint.name,
			variables: blueprint.variables.map((item) => {
				if (item.value) {
					item.value = JSON.stringify(item.value);
				}

				if (item.metadata) {
					item.metadata = JSON.stringify(item.metadata);
				}

				if (!item.locale) {
					item.locale = Initialize.Locale();
				}

				return item;
			}),
		},
		{
			'X-CREATIF-API-KEY': Initialize.ApiKey(),
			'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
		},
	);
}
