import ArrayBadges from '@app/uiComponents/lists/list/ArrayBadges';
import { Badge } from '@mantine/core';
import classNames from 'classnames';
import React, { useMemo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/ItemView.module.css';

interface Props<Value, Metadata> {
    value: Value;
    metadata: Metadata;
}
export default function ItemView<Value, Metadata>({ value }: Props<Value, Metadata>) {
    const grid = useMemo(() => {
        if (!value) return [];

        const keys = Object.keys(value);

        const internalGrid: { column: string; value: React.ReactNode }[] = [];
        for (const key of keys) {
            if (typeof value === 'object' && Object.hasOwn(value, key)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const val = value[key];

                //console.log(key, val);

                if (typeof val !== 'boolean' && !val) {
                    internalGrid.push({
                        column: key,
                        value: '-',
                    });
                }

                if (typeof val === 'string' && val) {
                    internalGrid.push({
                        column: key,
                        value: val,
                    });
                }

                if (Array.isArray(val)) {
                    if (val.length === 0) {
                        internalGrid.push({
                            column: key,
                            value: '-',
                        });
                    } else {
                        internalGrid.push({
                            column: key,
                            value: <ArrayBadges values={val} />,
                        });
                    }
                }

                if (typeof val === 'boolean') {
                    if (val) {
                        internalGrid.push({
                            column: key,
                            value: <Badge color="green">true</Badge>,
                        });
                    } else {
                        internalGrid.push({
                            column: key,
                            value: <Badge color="red">false</Badge>,
                        });
                    }
                }
            }
        }

        return internalGrid;
    }, []);
    return (
        <div className={styles.root}>
            {grid.map((item, i) => (
                <React.Fragment key={i}>
                    <div className={classNames(styles.columnRowShared, styles.column)}>{item.column}</div>
                    <div className={classNames(styles.columnRowShared, styles.row)}>{item.value}</div>
                </React.Fragment>
            ))}
        </div>
    );
}
