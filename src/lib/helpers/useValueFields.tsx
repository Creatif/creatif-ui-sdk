import React from 'react';
import ArrayBadges from '@app/uiComponents/shared/ArrayBadges';
import { Badge } from '@mantine/core';

export type Column = {
    column: string;
    innerColumn?: Column[] | Column[][];
    value: React.ReactNode;
};

function recursiveFieldsResolved(value: object) {
    const keys = Object.keys(value as object);

    const values: Column[] = [];
    for (const key of keys) {
        if (typeof value === 'object' && Object.hasOwn(value as object, key)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const val = value[key];

            if (typeof val !== 'boolean' && !val) {
                values.push({
                    column: key,
                    value: '-',
                });
            }

            if (typeof val === 'string' && val) {
                values.push({
                    column: key,
                    value: val,
                });
            }

            if (Array.isArray(val)) {
                if (val.length === 0) {
                    values.push({
                        column: key,
                        value: '-',
                    });
                } else {
                    if (val.every((val) => typeof val !== 'object')) {
                        values.push({
                            column: key,
                            value: <ArrayBadges values={val} />,
                        });
                    } else {
                        const columns = [];
                        for (let i = 0; i < val.length; i++) {
                            const v = val[i];
                            columns.push(recursiveFieldsResolved(v));
                        }

                        values.push({
                            column: key,
                            value: '',
                            innerColumn: columns,
                        });
                    }
                }
            }

            if (typeof val === 'boolean') {
                if (val) {
                    values.push({
                        column: key,
                        value: <Badge color="green">true</Badge>,
                    });
                } else {
                    values.push({
                        column: key,
                        value: <Badge color="red">false</Badge>,
                    });
                }
            }

            if (typeof val === 'number') {
                values.push({
                    column: key,
                    value: val,
                });
            }

            if (val && typeof val === 'object' && !Array.isArray(val)) {
                values.push({
                    column: key,
                    value: '',
                    innerColumn: recursiveFieldsResolved(val),
                });
            }
        }
    }

    return values;
}

export default function useValueFields<Value>(value?: Value) {
    if (value) return recursiveFieldsResolved(value);
}
