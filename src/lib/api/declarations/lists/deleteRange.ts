import { tryHttp } from '@lib/http/tryHttp';
import type { DeleteRangeBlueprint } from '@root/types/api/list';
import { declarations } from '@lib/http/fetchInstance';

export default function deleteRange(blueprint: DeleteRangeBlueprint) {
    return tryHttp<unknown, { items: string[]; name: string }>(
        declarations(),
        'post',
        `/list/range/${blueprint.projectId}/${blueprint.name}`,
        {
            name: blueprint.name,
            items: blueprint.items,
        },
    );
}
