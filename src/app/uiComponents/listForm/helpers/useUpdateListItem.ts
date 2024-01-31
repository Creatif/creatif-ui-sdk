import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import { useParams } from 'react-router-dom';
import type { Behaviour } from '@root/types/api/shared';
import { Credentials } from '@app/credentials';

export default function useUpdateListItem(isUpdate: boolean) {
    if (!isUpdate) return;
    const { structureId, itemId } = useParams();

    if (!structureId || !itemId) {
        throw new Error(
            'There are no \'structureId\' or \'itemId\' route parameters in the URL. They must be provided in order for automatic update to work.',
        );
    }

    return async (name: string, value: unknown, metadata: unknown, groups: string[], behaviour: Behaviour) => {
        const { result, error } = await updateListItem({
            itemId: itemId,
            projectId: Credentials.ProjectID(),
            name: structureId,
            values: {
                name,
                value,
                locale: Credentials.Locale(),
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
