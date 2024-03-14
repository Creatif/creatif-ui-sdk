import type { GetListItemByID, ListItem } from '@root/types/api/publicApi/Lists';
import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { parseOptions } from '@lib/publicApi/app/parseOptions';

export async function getListItemById<Value>(blueprint: GetListItemByID): Promise<Result<ListItem<Value>>> {
    const httpResult = await tryHttp<ListItem<Value>>(
        'get',
        `${Routes.GET_LIST_ITEM_BY_ID}/${blueprint.id}${parseOptions(blueprint.options)}`,
        null,
        {},
    );

    return determineResult<ListItem<Value>>(httpResult);
}
