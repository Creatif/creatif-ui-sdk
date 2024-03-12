import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { MapItem } from '@root/types/api/publicApi/Maps';

export async function getMapByName<Value>(name: string): Promise<Result<MapItem<Value>>> {
    const httpResult = await tryHttp<MapItem<Value>>('get', `${Routes.GET_MAP_ITEM_BY_NAME}/${name}`, null, {});

    return determineResult<MapItem<Value>>(httpResult);
}
