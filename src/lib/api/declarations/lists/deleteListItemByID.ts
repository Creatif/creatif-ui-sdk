import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
import type { DeleteListItemBlueprint } from '@root/types/api/list';

export default function deleteListItemByID(blueprint: DeleteListItemBlueprint) {
    if (!blueprint.id && !blueprint.name && !blueprint.shortId) {
        throw new Error('To identify the list, you must provide either list id, name or shortID. None was provided.');
    }

    if (!blueprint.itemId && blueprint.itemShortId) {
        throw new Error('To identify a list item, you must provide either itemId or itemShortId. None was provided.');
    }

    const locale = blueprint.locale ? blueprint.locale : Initialize.Locale();
    return tryPost(
        declarations(),
        `/list/item-id/${Initialize.ProjectID()}`,
        {
            name: blueprint.name,
            id: blueprint.id,
            locale: locale,
            shortID: blueprint.shortId,
            itemID: blueprint.itemId,
            itemShortID: blueprint.itemShortId,
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}
