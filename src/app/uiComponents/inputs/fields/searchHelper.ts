import type { StructureType } from '@root/types/shell/shell';
import paginateList from '@lib/api/declarations/lists/paginateList';
import { Runtime } from '@app/systems/runtime/Runtime';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import type { ConnectionSearchInputOption } from '@app/uiComponents/inputs/fields/ConnectionSearchInput';
import { ApiError } from '@lib/http/apiError';

export async function searchAndCreateOptions(
    structureId: string,
    structureType: StructureType,
    search: string,
    page: number,
    limit = 100,
): Promise<{
    options: ConnectionSearchInputOption[] | undefined;
    error: ApiError | undefined;
}> {
    if (structureType === 'list') {
        const { result, error } = await paginateList({
            search: search,
            name: structureId,
            limit: limit,
            page: page,
            orderBy: 'created_at',
            projectId: Runtime.instance.currentProjectCache.getProject().id,
            fields: ['value'],
        });

        if (result) {
            return {
                options: result.data.map((item) => ({
                    label: item.name,
                    value: JSON.stringify({
                        id: item.id,
                        structureType: 'list',
                    }),
                })),
                error: undefined,
            };
        }

        if (error) {
            return {
                options: undefined,
                error: error,
            };
        }

        return {
            options: undefined,
            error: new ApiError(
                'Could not determine type',
                {
                    data: {
                        invalidType: 'Could not determine type',
                    },
                },
                400,
            ),
        };
    }

    if (structureType === 'map') {
        const { result, error } = await paginateMapVariables({
            search: search,
            name: structureId,
            limit: 100,
            orderBy: 'created_at',
            page: page,
            fields: ['value'],
            projectId: Runtime.instance.currentProjectCache.getProject().id,
        });

        if (result) {
            return {
                options: result.data.map((item) => ({
                    label: item.name,
                    value: JSON.stringify({
                        id: item.id,
                        structureType: 'map',
                    }),
                })),
                error: undefined,
            };
        }

        if (error) {
            return {
                options: undefined,
                error: error,
            };
        }

        return {
            options: undefined,
            error: new ApiError(
                'Could not determine type',
                {
                    data: {
                        invalidType: 'Could not determine type',
                    },
                },
                400,
            ),
        };
    }

    return {
        options: undefined,
        error: new ApiError(
            'Could not determine type',
            {
                data: {
                    invalidType: 'Could not determine type',
                },
            },
            400,
        ),
    };
}
