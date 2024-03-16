import type { GetListItemByID, ListItem } from '@root/types/api/publicApi/Lists';
import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { parseQuery } from '@lib/publicApi/app/parseQuery';

export async function getListItemById<Value>(blueprint: GetListItemByID): Promise<Result<ListItem<Value>>> {
    const httpResult = await tryHttp<ListItem<Value>>(
        'get',
        `${Routes.GET_LIST_ITEM_BY_ID}/${blueprint.id}${parseQuery(blueprint.options, undefined)}`,
        null,
        {},
    );

    return determineResult<ListItem<Value>>(httpResult);
}
