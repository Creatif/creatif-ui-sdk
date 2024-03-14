import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { GetMapItemByID, MapItem } from '@root/types/api/publicApi/Maps';
import { parseOptions } from '@lib/publicApi/app/parseOptions';

export async function getMapItemById<Value>(blueprint: GetMapItemByID): Promise<Result<MapItem<Value>>> {
    const httpResult = await tryHttp<MapItem<Value>>(
        'get',
        `${Routes.GET_MAP_ITEM_BY_ID}/${blueprint.id}${parseOptions(blueprint.options)}`,
        null,
        {},
    );

    return determineResult<MapItem<Value>>(httpResult);
}
