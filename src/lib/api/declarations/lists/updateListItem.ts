import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
import type { UpdateListItemBlueprint, UpdateListItemResult } from '@root/types/api/list';
export async function updateListItem(blueprint: UpdateListItemBlueprint) {
    return tryPost<UpdateListItemResult>(
        declarations(),
        `/list/update-item-by-id/${Initialize.ProjectID()}/${blueprint.name}/${
            blueprint.itemID
        }?fields=name|metadata|groups|behaviour|value|locale`,
        {
            values: {
                name: blueprint.variable.name,
                locale: blueprint.variable.locale || Initialize.Locale(),
                groups: blueprint.variable.groups,
                behaviour: blueprint.variable.behaviour,
                value: blueprint.variable.value ? JSON.stringify(blueprint.variable.value) : null,
                metadata: blueprint.variable.metadata ? JSON.stringify(blueprint.variable.metadata) : null,
            },
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}
