import type { TreeBuilderNode } from '@app/routes/show/representation/treeBuilder';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/representation/css/root.module.css';
import { Badge } from '@mantine/core';
import React from 'react';
import classNames from 'classnames';
import { Expandable } from '@app/routes/show/representation/Expandable';

interface Props {
    node: TreeBuilderNode;
}

export function Node({ node: { children, level, type } }: Props) {
    return (
        <div
            className={classNames(styles.root, styles.nodeRoot, type === 'object' ? styles.nodeRootObject : undefined)}
            style={{
                paddingLeft: `${level * 8}px`,
            }}>
            {children?.map((child, idx) => {
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

                if (child.type === 'null' || child.type === 'undefined') {
                    return (
                        <div key={idx} className={styles.item}>
                            <h2>{child.name}</h2>
                            <div className={styles.numberValue}>
                                {typeof child.data === 'undefined' && <Badge color="gray">undefined</Badge>}
                                {child.data === null && <Badge color="gray">null</Badge>}
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
