import type { Root } from '@app/routes/show/representation/treeBuilder';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/representation/css/root.module.css';
import { Node } from '@app/routes/show/representation/Node';
import { Badge } from '@mantine/core';
import React, { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

interface Props {
    root: Root;
}

export function Root({ root: { children, level } }: Props) {
    const [expand, setExpand] = useState(false);

    return (
        <div
            className={styles.root}
            style={{
                paddingLeft: `${level * 24}px`,
            }}>
            {children.map((child, idx) => {
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
                    return (
                        <div onClick={() => setExpand((e) => !e)} key={idx}>
                            <span
                                className={styles.expandable}
                                style={{
                                    marginBottom: `${expand ? '1rem' : 0}`,
                                }}>
                                {child.name}{' '}
                                {expand ? (
                                    <IconChevronDown className={styles.expandIcon} size={16} />
                                ) : (
                                    <IconChevronRight className={styles.expandIcon} size={16} />
                                )}{' '}
                            </span>
                            {expand && <Node key={idx} node={child} />}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}
