import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { UpdateListItemBlueprint, UpdateListItemResult } from '@root/types/api/list';
export async function updateListItem(blueprint: UpdateListItemBlueprint) {
    let fields = 'name|metadata|groups|behaviour|value|locale';
    if (Array.isArray(blueprint.fields) && blueprint.fields.length !== 0) {
        fields = blueprint.fields.join('|');
    }
    return tryHttp<UpdateListItemResult>(
        declarations(),
        'post',
        `/list/update-item-by-id/${blueprint.projectId}/${blueprint.name}/${blueprint.itemId}?fields=${fields}`,
        {
            values: {
                name: blueprint.values.name,
                locale: blueprint.values.locale,
                groups: blueprint.values.groups,
                behaviour: blueprint.values.behaviour,
                value: blueprint.values.value ? JSON.stringify(blueprint.values.value) : null,
                metadata: blueprint.values.metadata ? JSON.stringify(blueprint.values.metadata) : null,
            },
        },
    );
}
