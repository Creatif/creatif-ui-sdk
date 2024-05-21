// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/css/item.module.css';
import Copy from '@app/components/Copy';
import Groups from '@app/components/Groups';
import React from 'react';
import type { QueriedMapItem } from '@root/types/api/map';

interface Props {
    variable: QueriedMapItem;
}

export default function StructureItem({ variable }: Props) {
    return (
        <div className={styles.contentGrid}>
            <div className={styles.row}>
                <h2>ID</h2>
                <div className={styles.rowValue}>
                    {variable.id} <Copy onClick={() => navigator.clipboard.writeText(variable.id || '')} />
                </div>
            </div>

            <div className={styles.row}>
                <h2>Short ID</h2>
                <div className={styles.rowValue}>
                    {variable.shortId} <Copy onClick={() => navigator.clipboard.writeText(variable.id || '')} />
                </div>
            </div>

            <div className={styles.row}>
                <h2>Behaviour</h2>
                <div>{variable.behaviour}</div>
            </div>

            <div className={styles.row}>
                <h2>Groups</h2>
                <div>
                    {variable.groups && Boolean(variable.groups.length) ? <Groups groups={variable.groups} /> : '-'}
                </div>
            </div>

            <div className={styles.row}>
                <h2>Locale</h2>
                <div>{variable.locale}</div>
            </div>
        </div>
    );
}
