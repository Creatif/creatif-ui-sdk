import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { queryConstructor } from '@lib/publicApi/lib/queryConstructor';
import type { MapItem, PaginateMapItems } from '@root/types/api/publicApi/Maps';

export async function paginateMapItems<Value>(blueprint: PaginateMapItems): Promise<Result<MapItem<Value>[]>> {
    const httpResult = await tryHttp<MapItem<Value>[]>(
        'get',
        `${Routes.GET_MAP_ITEMS}/${blueprint.structureName}${queryConstructor(
            blueprint.page,
            blueprint.groups,
            blueprint.orderBy,
            blueprint.orderDirection,
            blueprint.search,
            blueprint.locales,
        )}`,
        null,
        {
            'Creatif-Version': blueprint.versionName || '',
        },
    );

    return determineResult<MapItem<Value>[]>(httpResult);
}
