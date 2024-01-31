import { Credentials } from '@app/credentials';
import useNotification from '@app/systems/notifications/useNotification';
import { appendToList } from '@lib/api/declarations/lists/appendToList';
import type { Behaviour } from '@root/types/api/shared';
import type { BeforeSaveReturnType } from '@root/types/forms/forms';
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
                    locale: Credentials.Locale(),
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
