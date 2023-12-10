import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import { exists } from '@lib/validation/exists';
import type { CreateVariableBlueprint } from '@lib/api/declarations/types/variableTypes';
export async function createVariable(blueprint: CreateVariableBlueprint) {
	return tryPut(
		declarations(),
		`/variable/${Initialize.ProjectID()}/${blueprint.locale ? blueprint.locale : Initialize.Locale()}`,
		{
			name: blueprint.name,
			behaviour: blueprint.behaviour,
			groups: blueprint.groups,
			metadata: !exists('metadata', blueprint.metadata) ? JSON.stringify(blueprint.metadata) : null,
			value: !exists('value', blueprint.value) ? JSON.stringify(blueprint.value) : null,
		},
	);
}
