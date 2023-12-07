import useNotification from '@app/systems/notifications/useNotification';
import {appendToList} from '@lib/api/declarations/lists/appendToList';
import type {Behaviour} from '@lib/api/declarations/types/sharedTypes';
export default function useAppendToList(structureName: string) {
	const {error: errorNotification, success} = useNotification();

	return async (
		name: string,
		behaviour: Behaviour,
		groups: string[],
		beforeSaveResult: any
	) => {
		const {result, error} = await appendToList({
			name: structureName,
			variables: [
				{
					name: name,
					behaviour: behaviour,
					groups: groups,
					value: beforeSaveResult,
				},
			],
		});

		if (error) {
			errorNotification(
				'An error occurred.',
				`List variable with name ${name} could not be created. See the development bar for more details.`,
			);

			return false;
		}

		if (result) {
			success(
				`Variable for structure ${structureName}`,
				`List variable '${name}' has been created.`,
			);

			return true;
		}
	};
}