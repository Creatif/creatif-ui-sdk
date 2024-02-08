import type { StructureType } from '@root/types/shell/shell';
import type { AsyncAutocompleteSelectOption } from '@app/uiComponents/inputs/fields/AsyncAutocompleteSelect';
import paginateList from '@lib/api/declarations/lists/paginateList';
import { Runtime } from '@app/runtime/Runtime';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import queryMapVariable from '@lib/api/declarations/maps/queryMapVariable';

export async function searchAndCreateOptions(
    structureId: string,
    structureType: StructureType,
    search: string,
): Promise<AsyncAutocompleteSelectOption[]> {
    if (structureType === 'list') {
        const { result, error } = await paginateList({
            search: search,
            name: structureId,
            limit: 1000,
            page: 1,
            orderBy: 'created_at',
            projectId: Runtime.instance.credentials.projectId,
        });

        if (result) {
            return result.data.map((item) => ({
                label: item.name,
                value: JSON.stringify({
                    id: item.id,
                    structureType: 'list',
                }),
            }));
        }

        if (error) {
            throw error;
        }

        return [];
    }

    if (structureType === 'map') {
        const { result, error } = await paginateMapVariables({
            search: search,
            name: structureId,
            limit: 100,
            page: 1,
            projectId: Runtime.instance.credentials.projectId,
        });

        if (result) {
            return result.data.map((item) => ({
                label: item.name,
                value: JSON.stringify({
                    id: item.id,
                    structureType: 'map',
                }),
            }));
        }

        if (error) {
            throw error;
        }

        return [];
    }

    const { result, error } = await paginateVariables({
        search: search,
        name: structureId,
        limit: 100,
        page: 1,
        projectId: Runtime.instance.credentials.projectId,
    });

    if (result) {
        return result.data.map((item) => ({
            label: item.name,
            value: JSON.stringify({
                id: item.id,
                structureType: 'list',
            }),
        }));
    }

    if (error) {
        throw error;
    }

    return [];
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