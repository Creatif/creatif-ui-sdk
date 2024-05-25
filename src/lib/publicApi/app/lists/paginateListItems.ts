import type { ListItem, PaginateListItems } from '@root/types/api/publicApi/Lists';
import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { queryConstructor } from '@lib/publicApi/lib/queryConstructor';

export async function paginateListItems<Value>(blueprint: PaginateListItems): Promise<Result<ListItem<Value>[]>> {
    const httpResult = await tryHttp<ListItem<Value>[]>(
        'get',
        `${Routes.GET_LIST_ITEMS}/${blueprint.structureName}${queryConstructor(
            blueprint.page,
            blueprint.groups,
            blueprint.orderBy,
            blueprint.orderDirection,
            blueprint.search,
            blueprint.locales,
            blueprint.options,
        )}`,
        null,
        {
            'Creatif-Version': blueprint.versionName || '',
        },
    );

    return determineResult<ListItem<Value>[]>(httpResult);
}
