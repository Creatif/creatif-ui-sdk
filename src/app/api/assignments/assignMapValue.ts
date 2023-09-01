import { assignments } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type { AssignedMapResponse, AssignedValue, NodeAssignmentBlueprint } from '@root/types';

export async function assignMapValue<T extends AssignedValue>(blueprint: NodeAssignmentBlueprint<T>) {
	// validation goes here

	return tryPut<AssignedMapResponse<T>>(assignments(), '/map', {
		name: blueprint.name,
		value: JSON.stringify(blueprint.value),
	});
}
