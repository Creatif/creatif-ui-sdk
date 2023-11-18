import { assignments } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type {
	AssignedNodeResponse,
	AssignedValue,
	NodeAssignmentBlueprint,
} from '@root/types/types';

export async function assignValue<T extends AssignedValue, F>(
	blueprint: NodeAssignmentBlueprint<T>,
) {
	// validation goes here

	return tryPut<AssignedNodeResponse<T, F>>(assignments(), '/node', {
		name: blueprint.name,
		value: JSON.stringify(blueprint.value),
	});
}
