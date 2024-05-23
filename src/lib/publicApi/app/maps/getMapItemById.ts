import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import type { GetMapItemByID, MapItem } from '@root/types/api/publicApi/Maps';
import { parseQuery } from '@lib/publicApi/app/parseQuery';

export async function getMapItemById<Value>(blueprint: GetMapItemByID): Promise<Result<MapItem<Value>>> {
    const httpResult = await tryHttp<MapItem<Value>>(
        'get',
        `${Routes.GET_MAP_ITEM_BY_ID}/${blueprint.id}${parseQuery(blueprint.options, undefined)}`,
        null,
        {
            'Creatif-Version': blueprint.versionName || '',
        },
    );

    return determineResult<MapItem<Value>>(httpResult);
}
