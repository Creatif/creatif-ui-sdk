import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import type { AddToMapBlueprint, CreatedMap } from '@root/types/api/map';
export default function addToMap(blueprint: AddToMapBlueprint) {
    return tryHttp<CreatedMap>(declarations(), 'put', `/map/add/${blueprint.projectId}`, {
        name: blueprint.name,
        variable: {
            name: blueprint.variable.name,
            locale: blueprint.variable.locale,
            behaviour: blueprint.variable.behaviour,
            groups: blueprint.variable.groups,
            value: blueprint.variable.value ? JSON.stringify(blueprint.variable.value) : null,
            metadata: blueprint.variable.metadata ? JSON.stringify(blueprint.variable.metadata) : null,
        },
        references: blueprint.references,
        imagePaths: blueprint.imagePaths,
    });
}
