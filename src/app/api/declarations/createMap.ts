import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type { CreateMapResponse, MapBlueprint } from '@root/types';

export async function createMap(blueprint: MapBlueprint) {
	// validation goes here

	return tryPut<CreateMapResponse>(declarations(), '/map', {
		name: blueprint.name,
		nodes: blueprint.nodes,
	});
}
