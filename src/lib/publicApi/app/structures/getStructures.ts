import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import type { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import type { Structure } from '@root/types/api/publicApi/Structures';

export async function getStructures(): Promise<Result<Structure[]>> {
    const httpResult = await tryHttp<Structure[]>('get', `${Routes.GET_STRUCTURES}`, null, {});

    return determineResult<Structure[]>(httpResult);
}
