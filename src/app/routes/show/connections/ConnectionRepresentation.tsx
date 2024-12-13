import type { ChildStructure, PaginationResult } from '@root/types/api/shared';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import React from 'react';
import useSearchQuery from '@app/routes/show/hooks/useSearchQuery';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import { List } from '@app/routes/show/connections/List';
import { useQuery } from 'react-query';
import paginateConnections from '@lib/api/declarations/connections/paginateConnections';
import { Runtime } from '@app/systems/runtime/Runtime';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import Loading from '@app/components/Loading';

interface Props {
    structure: ChildStructure;
    variableId: string;
}

export function ConnectionRepresentation({ structure, variableId }: Props) {
    const { queryParams, setParam } = useSearchQuery();
    const connectionStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structure.structureName, structure.structureType);

    const locales = queryParams.locales;
    const groups = queryParams.groups;
    const direction = queryParams.direction;
    const orderBy = queryParams.orderBy;
    const search = queryParams.search;

    const { isFetching, data, error } = useQuery<unknown, ApiError, PaginationResult<unknown, unknown>>(
        ['paginate_connections', locales, groups, direction, orderBy, search],
        async () => {
            if (!connectionStructureItem) return;

            const { result, error } = await paginateConnections({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                structureId: connectionStructureItem.id,
                parentVariableId: variableId,
                structureType: structure.structureType,
                locales: queryParams.locales,
                groups: queryParams.groups,
                direction: queryParams.direction,
                behaviour: queryParams.behaviour,
                orderBy: queryParams.orderBy,
                search: queryParams.search || '',
                fields: ['groups'],
                limit: 100,
                page: parseInt(queryParams.page) || 1,
            });

            if (error) throw error;

            return result;
        },
    );

    return (
        <>
            {connectionStructureItem && (
                <ActionSection
                    includeCreateButton={false}
                    includeHeading={false}
                    includeSortBy={['created_at', 'updated_at']}
                    structureItem={connectionStructureItem}
                    isLoading={false}
                    sortBy={queryParams.orderBy || 'index'}
                    search={queryParams.search || ''}
                    locales={queryParams.locales}
                    direction={queryParams.direction}
                    behaviour={queryParams.behaviour}
                    groups={queryParams.groups}
                    onDirectionChange={(direction) => {
                        setParam('direction', direction as string);
                    }}
                    onSelectedLocales={(locales) => {
                        setParam('locales', locales.join(','));
                    }}
                    onBehaviourChange={(behaviour) => {
                        setParam('behaviour', behaviour as string);
                    }}
                    onSortChange={(sortType) => {
                        setParam('orderBy', sortType);
                    }}
                    onSelectedGroups={(groups) => {
                        setParam('groups', groups.join(','));
                    }}
                    onSearch={(text) => {
                        setParam('search', text);
                    }}
                />
            )}

            {error && <UIError title="Something went wrong. Please, try again later" />}

            {!isFetching && connectionStructureItem && data && (
                <List structureItem={connectionStructureItem} items={data} />
            )}
        </>
    );
}
