import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { appendToList } from '@lib/api/declarations/lists/appendToList';
import type { BeforeSaveReturnType } from '@app/uiComponents/types/forms';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
export default function useAppendToList(structureName: string) {
	const { error: errorNotification, success } = useNotification();

	return async (name: string, behaviour: Behaviour, groups: string[], beforeSaveResult: BeforeSaveReturnType) => {
		const { result, error } = await appendToList({
			name: structureName,
			variables: [
				{
					name: name,
					behaviour: behaviour,
					groups: groups,
					locale: Initialize.Locale(),
					value: beforeSaveResult.value,
					metadata: beforeSaveResult.metadata,
				},
			],
		});

		if (error) {
			errorNotification(
				'An error occurred.',
				`List variable with name ${name} could not be created. See the development bar for more details.`,
			);

			return;
		}

		if (result) {
			success(`Variable for structure ${structureName}`, `List variable '${name}' has been created.`);

			return result;
		}
	};
}
