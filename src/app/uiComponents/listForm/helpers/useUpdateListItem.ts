import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import { useParams } from 'react-router-dom';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';

export default function useUpdateListItem(isUpdate: boolean) {
	if (!isUpdate) return;
	const { structureId, itemId } = useParams();

	if (!structureId || !itemId) {
		throw new Error(
			'There are no \'structureId\' or \'itemId\' route parameters in the URL. They must be provided in order for automatic update to work.',
		);
	}

	return async (
		name: string,
		value: unknown,
		metadata: unknown,
		groups: string[],
		behaviour: Behaviour,
	) => {
		const { result, error } = await updateListItem({
			itemID: itemId,
			name: structureId,
			variable: {
				name,
				value,
				metadata,
				groups,
				behaviour,
			},
		});

		if (error) {
			return undefined;
		}

		return result;
	};
}
