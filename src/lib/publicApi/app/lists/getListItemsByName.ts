import type { GetListItemsByName, ListItem } from '@root/types/api/publicApi/Lists';
import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { parseQuery } from '@lib/publicApi/app/parseQuery';

export async function getListItemsByName<Value>(blueprint: GetListItemsByName): Promise<Result<ListItem<Value>[]>> {
    const httpResult = await tryHttp<ListItem<Value>[]>(
        'get',
        `${Routes.GET_LISTS_ITEMS_BY_NAME}/${blueprint.structureName}/${blueprint.name}${parseQuery(
            blueprint.options,
            blueprint.locale,
        )}`,
        null,
        {
            'Creatif-Version': blueprint.versionName || '',
        },
    );

    return determineResult<ListItem<Value>[]>(httpResult);
}
