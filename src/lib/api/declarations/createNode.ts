import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type { Node, NodeRequestBlueprint } from '@root/types/types';

export async function createNode<T>(blueprint: NodeRequestBlueprint<T>) {
	// validation goes here
	return tryPut<Node<T>>(declarations(), '/node', {
		name: blueprint.name,
		behaviour: blueprint.behaviour,
		groups: blueprint.groups,
		metadata: blueprint.metadata ? JSON.stringify(blueprint.metadata) : null,
	});
}
