import { declarations } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
import type { BatchRequestBlueprint, BatchResponse } from '@root/types';

export async function getBatchedNodes(nodes: BatchRequestBlueprint[]) {
	// validation goes here

	return tryPost<BatchResponse>(declarations(), '/combined', nodes);
}
