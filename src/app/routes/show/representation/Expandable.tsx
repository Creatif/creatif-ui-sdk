// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/representation/css/root.module.css';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import type { TreeBuilderNode } from '@app/routes/show/representation/treeBuilder';
import { Node } from '@app/routes/show/representation/Node';
import React, { useState } from 'react';

interface Props {
    child: TreeBuilderNode;
}

export function Expandable({ child }: Props) {
    const [expand, setExpand] = useState(false);

    console.log(child);

    return (
        <div
            className={styles.expandableRoot}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpand((e) => !e);
            }}>
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
            {expand && <Node node={child} />}
        </div>
    );
}
