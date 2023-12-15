import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import type { CreateListBlueprint } from '@root/types/api/list';
export async function createList(blueprint: CreateListBlueprint) {
    return tryPut(declarations(), `/list/${Initialize.ProjectID()}`, {
        name: blueprint.name,
    });
}
