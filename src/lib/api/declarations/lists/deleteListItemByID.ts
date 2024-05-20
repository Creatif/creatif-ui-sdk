import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { DeleteListItemBlueprint } from '@root/types/api/list';
import { Runtime } from '@app/systems/runtime/Runtime';

export default function deleteListItemByID(blueprint: DeleteListItemBlueprint) {
    if (!blueprint.id && !blueprint.name && !blueprint.shortId) {
        throw new Error('To identify the list, you must provide either list id, name or shortID. None was provided.');
    }

    if (!blueprint.itemId && blueprint.itemShortId) {
        throw new Error('To identify a list item, you must provide either itemId or itemShortId. None was provided.');
    }

    const locale = blueprint.locale ? blueprint.locale : Runtime.instance.currentLocaleStorage.getLocale();
    return tryHttp(declarations(), 'post', `/list/item-id/${blueprint.projectId}`, {
        name: blueprint.name,
        id: blueprint.id,
        locale: locale,
        shortID: blueprint.shortId,
        itemID: blueprint.itemId,
        itemShortID: blueprint.itemShortId,
    });
}
