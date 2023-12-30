import { DataTable } from 'mantine-datatable';
import type { PaginationResult } from '@root/types/api/list';
import { Badge } from '@mantine/core';
import styles from './css/table.module.css';
import React from 'react';
import type { Behaviour } from '@root/types/api/shared';
interface Props<Value, Metadata> {
    data: PaginationResult<Value, Metadata>;
    isFetching: boolean;
}

interface Record {
    name: string;
    id: string;
    behaviour: Behaviour;
    groups: string[];
}
function resolveColumns(values: never) {
    console.log(values);
    const columnKeys = Object.keys(values);
    const columns = [
        {
            accessor: 'name',
            sortable: false,
        },
        {
            accessor: 'behaviour',
            sortable: false,
        },
        {
            accessor: 'groups',
            sortable: false,
            width: '240px',
            render: (item: Record) => (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                    }}>
                    {item.groups.map((group, i) => (
                        <Badge color="var(--mantine-color-indigo-4)" key={i}>
                            {group}
                        </Badge>
                    ))}
                </div>
            ),
        },
    ];
    for (const colKey of columnKeys) {
        columns.push({
            accessor: colKey,
            sortable: false,
        });
    }

    return columns;
}
function createRecords(data: PaginationResult<unknown, unknown>) {
    const records: Record[] = [];

    for (const item of data.data) {
        const singleRecord: Record = {
            name: '-',
            id: '-',
            behaviour: 'modifiable',
            groups: [],
        };
        singleRecord['name'] = item.name;
        singleRecord['id'] = item.id;
        singleRecord['behaviour'] = item.behaviour as Behaviour;
        singleRecord['groups'] = item.groups as string[];

        if (item.value && typeof item.value === 'object') {
            const keys = Object.keys(item.value as object);

            for (const key of keys) {
                const val = item.value[key];
                if (typeof val !== 'boolean' && !val) {
                    singleRecord[key] = '-';
                }

                if (typeof val === 'string' && val) {
                    singleRecord[key] = val;
                }

                if (Array.isArray(val)) {
                    if (val.length === 0) {
                        singleRecord[key] = '-';
                    } else {
                        singleRecord[key] = val;
                    }
                }

                if (typeof val === 'boolean') {
                    if (val) {
                        singleRecord[key] = <Badge color="green">true</Badge>;
                    } else {
                        singleRecord[key] = <Badge color="red">false</Badge>;
                    }
                }

                if (typeof val === 'number') {
                    singleRecord[key] = val;
                }
            }
        }

        console.log(singleRecord);
        records.push(singleRecord);
    }

    return records;
}
export default function MainTableView<Value, Metadata>({ data, isFetching }: Props<Value, Metadata>) {
    return (
        <>
            {!isFetching && data.data.length !== 0 && (
                <div
                    style={{
                        maxWidth: '1280px',
                    }}>
                    <DataTable
                        className={styles.table}
                        withTableBorder
                        highlightOnHover
                        striped
                        borderRadius="sm"
                        withColumnBorders
                        columns={resolveColumns(data.data[0].value)}
                        records={createRecords(data)}
                        fetching={isFetching}
                    />
                </div>
            )}
        </>
    );
}
