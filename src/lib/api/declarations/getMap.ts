import { declarations } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type {
	CustomMapNode,
	GetMapResponse,
	NamesOnlyMapNode,
	NodeWithValue,
} from '@root/types/types';

export async function getMap(
	id: string,
	ret?: 'full' | 'names',
	fields?: string[],
) {
	// validation goes here

	const res = tryGet<NamesOnlyMapNode>(
		declarations(),
		`/map/${id}?return=${ret ? ret : 'names'}&fields=${
			Array.isArray(fields) ? fields?.join(',') : ''
		}`,
	);

	if (fields && fields.length !== 0) {
		return res as Promise<GetMapResponse<CustomMapNode<unknown, unknown>>>;
	}

	if (ret === 'full') {
		return res as Promise<GetMapResponse<NodeWithValue<unknown, unknown>>>;
	}

	return res as Promise<GetMapResponse<NamesOnlyMapNode>>;
}
