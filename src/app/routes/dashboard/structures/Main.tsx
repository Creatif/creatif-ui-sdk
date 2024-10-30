// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/dashboardMain.module.css';
import type { DashboardStructure } from '@root/types/api/stats';
import { List } from '@app/routes/dashboard/structures/List';
import UIError from '@app/components/UIError';
import React from 'react';
import type { ApiError } from '@lib/http/apiError';

interface Props {
    listStructures: DashboardStructure[];
    mapStructures: DashboardStructure[];
    error: ApiError | null;
}

export function Main({ listStructures, mapStructures, error }: Props) {
    return (
        <div className={styles.structuresRoot}>
            {listStructures.length !== 0 && <List type="list" structures={listStructures} />}
            {mapStructures.length !== 0 && <List type="map" structures={mapStructures} />}

            {error && (
                <UIError title="Something is wrong with displaying the dashboard statistics. Please, try refreshing or try again later" />
            )}
        </div>
    );
}
