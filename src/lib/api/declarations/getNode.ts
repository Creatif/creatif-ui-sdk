import { declarations } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type { NodeWithValue } from '@root/types';

export async function getNode<Metadata, Value>(id: string) {
	// validation goes here

	return tryGet<NodeWithValue<Metadata, Value>>(declarations(), `/node/${id}`);
}
