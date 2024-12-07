import type { ChildStructure } from '@root/types/api/shared';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import React from 'react';
import useSearchQuery from '@app/routes/show/hooks/useSearchQuery';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import { List } from '@app/routes/show/connections/List';

interface Props {
    structure: ChildStructure;
    variableId: string;
}

export function ConnectionRepresentation({ structure, variableId }: Props) {
    const { queryParams, setParam } = useSearchQuery();
    const connectionStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structure.structureName, structure.structureType);

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

            {connectionStructureItem && <List structureItem={connectionStructureItem} />}
            <p>{structure.structureType}</p>
            <p>{structure.structureName}</p>
            <p>{structure.structureId}</p>
            <p>{variableId}</p>
        </>
    );
}
