import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { AddToListBlueprint } from '@root/types/api/list';

export async function addToList(blueprint: AddToListBlueprint) {
    console.log(blueprint);
    return tryHttp(declarations(), 'put', `/list/add/${blueprint.projectId}`, {
        name: blueprint.name,
        variable: {
            name: blueprint.variable.name,
            behaviour: blueprint.variable.behaviour,
            groups: blueprint.variable.groups,
            locale: blueprint.variable.locale,
            value: blueprint.variable.value ? JSON.stringify(blueprint.variable.value) : null,
            metadata: blueprint.variable.metadata ? JSON.stringify(blueprint.variable.metadata) : null,
        },
        references: blueprint.references,
        imagePaths: blueprint.imagePaths,
    });
}
