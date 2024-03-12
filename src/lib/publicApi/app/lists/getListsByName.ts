import type { ListItem } from '@root/types/api/publicApi/Lists';
import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';

export async function getListsByName<Value>(name: string): Promise<Result<ListItem<Value>[]>> {
    const httpResult = await tryHttp<ListItem<Value>[]>('get', `${Routes.GET_LISTS_ITEM_BY_NAME}/${name}`, null, {});

    return determineResult<ListItem<Value>[]>(httpResult);
}
