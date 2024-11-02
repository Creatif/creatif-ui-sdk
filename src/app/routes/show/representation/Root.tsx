import type { TreeBuilderRoot } from '@app/routes/show/representation/treeBuilder';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/representation/css/root.module.css';
import { Badge } from '@mantine/core';
import React from 'react';
import { Expandable } from '@app/routes/show/representation/Expandable';

interface Props {
    root: TreeBuilderRoot;
}

export function Root({ root }: Props) {
    return (
        <div
            className={styles.root}
            style={{
                paddingLeft: `${root.level * 24}px`,
            }}>
            {root.children.map((child, idx) => {
                if (child.type === 'string') {
                    return (
                        <div key={idx} className={styles.item}>
                            <h2>{child.name}</h2>
                            <div className={styles.stringValue}>{child.data as string}</div>
                        </div>
                    );
                }

                if (child.type === 'number') {
                    return (
                        <div key={idx} className={styles.item}>
                            <h2>{child.name}</h2>
                            <div className={styles.numberValue}>{child.data as number}</div>
                        </div>
                    );
                }

                if (child.type === 'boolean') {
                    return (
                        <div key={idx} className={styles.item}>
                            <h2>{child.name}</h2>
                            <div className={styles.numberValue}>
                                {child.data ? <Badge color="green">true</Badge> : <Badge color="red">false</Badge>}{' '}
                            </div>
                        </div>
                    );
                }

                if (child.type === 'array') {
                    return <Expandable key={idx} child={child} />;
                }

                if (child.type === 'object') {
                    return <Expandable key={idx} child={child} />;
                }

                return null;
            })}
        </div>
    );
}
