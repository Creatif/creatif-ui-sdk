import type { StructureType } from '@root/types/shell/shell';
import paginateList from '@lib/api/declarations/lists/paginateList';
import { Runtime } from '@app/runtime/Runtime';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import queryMapVariable from '@lib/api/declarations/maps/queryMapVariable';
import type { ReferenceSearchInputOption } from '@app/uiComponents/inputs/fields/ReferenceSearchInput';
import { ApiError } from '@lib/http/apiError';

export async function searchAndCreateOptions(
    structureId: string,
    structureType: StructureType,
    search: string,
    page: number,
    limit = 100,
): Promise<{
    options: ReferenceSearchInputOption[] | undefined;
    error: ApiError | undefined;
}> {
    if (structureType === 'list') {
        const { result, error } = await paginateList({
            search: search,
            name: structureId,
            limit: limit,
            page: page,
            orderBy: 'created_at',
            projectId: Runtime.instance.credentials.projectId,
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
            page: page,
            projectId: Runtime.instance.credentials.projectId,
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

export async function queryItemById(structureId: string, id: string, structureType: StructureType) {
    if (structureType === 'list') {
        return await queryListItemByID({
            structureId: structureId,
            itemId: id,
            projectId: Runtime.instance.credentials.projectId,
        });
    }

    if (structureType === 'map') {
        return await queryMapVariable({
            structureId: structureId,
            itemId: id,
            projectId: Runtime.instance.credentials.projectId,
        });
    }
}
