import type { CreatedList, CreateListBlueprint } from '@root/types/api/list';
import { tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
export default function createList(blueprint: CreateListBlueprint) {
    return tryHttp<CreatedList>(declarations(), 'put', `/list/${blueprint.projectId}`, {
        name: blueprint.name,
    });
}
