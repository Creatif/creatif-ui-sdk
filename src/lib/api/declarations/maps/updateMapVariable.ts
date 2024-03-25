import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { UpdateMapItemResult, UpdateMapVariableBlueprint } from '@root/types/api/map';
export async function updateMapVariable(blueprint: UpdateMapVariableBlueprint) {
    let fields = 'name|metadata|groups|behaviour|value|locale';
    if (Array.isArray(blueprint.fields) && blueprint.fields.length !== 0) {
        fields = blueprint.fields.join('|');
    }

    return tryHttp<UpdateMapItemResult>(
        declarations(),
        'post',
        `/map/update/${blueprint.projectId}/${blueprint.name}/${blueprint.itemId}?fields=${fields}`,
        {
            variable: {
                name: blueprint.values.name,
                locale: blueprint.values.locale,
                groups: blueprint.values.groups,
                behaviour: blueprint.values.behaviour,
                value: blueprint.values.value ? JSON.stringify(blueprint.values.value) : null,
                metadata: blueprint.values.metadata ? JSON.stringify(blueprint.values.metadata) : null,
            },
            references: blueprint.references,
        },
        authHeaders(),
    );
}
