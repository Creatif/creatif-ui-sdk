import useNotification from '@app/systems/notifications/useNotification';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import { useParams } from 'react-router-dom';
import type { QueriedListItem } from '@lib/api/declarations/types/listTypes';

export default function useUpdateList<T>(isUpdateMode: boolean) {
	if (!isUpdateMode) return undefined;

	const { structureId, itemId } = useParams();
	const { error: errorNotification } = useNotification();

	if (!structureId || !itemId) {
		throw new Error(
			'There are no \'structureId\' or \'itemId\' route parameters in the URL. They must be provided in order for automatic update to work.',
		);
	}

	return async (): Promise<T> => {
		const { result, error } = await queryListItemByID<QueriedListItem<unknown, unknown>>({
			itemId: itemId,
			structureId: structureId,
		});

		if (error) {
			errorNotification(
				'Query list item error.',
				'The system cannot query this list item. Please, try again later.',
			);
			return undefined as T;
		}

		if (result) {
			return result?.value as T;
		}

		return {} as T;
	};
}
