// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import { Table } from '@mantine/core';
import React from 'react';
import { Item } from '@app/routes/show/connections/Item';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { useQuery } from 'react-query';
import paginateConnections from '@lib/api/declarations/connections/paginateConnections';
import useSearchQuery from '@app/routes/show/hooks/useSearchQuery';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { PaginationResult } from '@root/types/api/shared';

interface Props {
    structureItem: StructureItem;
    items: PaginationResult<unknown, unknown>;
}
export function List({ structureItem, items }: Props) {
    return (
        <div className={contentContainerStyles.root}>
            <Table.ScrollContainer minWidth={920}>
                <Table
                    verticalSpacing="md"
                    styles={{
                        th: {
                            fontWeight: 'bold',
                        },
                    }}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>NAME</Table.Th>
                            <Table.Th>LOCALE</Table.Th>
                            <Table.Th>GROUPS</Table.Th>
                            <Table.Th>CREATED ON</Table.Th>
                            <Table.Th>ACTIONS</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {items.data.map((item) => (
                            <Item key={item.id} item={item} structureItem={structureItem} />
                        ))}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </div>
    );
}
