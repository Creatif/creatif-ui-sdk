import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { Structure } from '@root/types/api/publicApi/Structures';

export async function getStructures(): Promise<Result<{ maps: Structure[]; lists: Structure[] }>> {
    const httpResult = await tryHttp<{ maps: Structure[]; lists: Structure[] }>(
        'get',
        `${Routes.GET_STRUCTURES}`,
        null,
        {},
    );

    return determineResult<{ maps: Structure[]; lists: Structure[] }>(httpResult);
}
