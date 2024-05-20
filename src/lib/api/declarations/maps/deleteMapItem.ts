import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { DeleteMapItemBlueprint } from '@root/types/api/map';

export default function deleteMapItem(blueprint: DeleteMapItemBlueprint) {
    return tryHttp(
        declarations(),
        'delete',
        `/map/entry/${blueprint.projectId}/${blueprint.name}/${blueprint.itemId}`,
        null,
    );
}
