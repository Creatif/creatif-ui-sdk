import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/dashboardMain.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import animationStyles from '@app/css/animations.module.css';
import { useQuery } from 'react-query';
import type { Result } from '@root/types/api/publicApi/Http';
import type { ApiError } from '@lib/http/apiError';
import type { DashboardStat, DashboardStructure, DashboardVersion } from '@root/types/api/stats';
import { getDashboardStats } from '@lib/api/stats/dashboard';
import { Runtime } from '@app/systems/runtime/Runtime';

import { ResentMain } from '@app/routes/dashboard/recent/RecentMain';
import classNames from 'classnames';
import { Main as StructureMain } from '@app/routes/dashboard/structures/Main';
import { Main as VersionMain } from '@app/routes/dashboard/versions/Main';

export default function DashboardMain() {
    const { data, error, isLoading } = useQuery<Result<DashboardStat>, ApiError>(
        'get_dashboard_stats',
        async () => {
            const { result, error } = await getDashboardStats(Runtime.instance.currentProjectCache.getProject().id);
            if (error) {
                throw error;
            }

            return { result, error };
        },
        {
            staleTime: -1,
        },
    );

    let listStructures: DashboardStructure[] = [];
    let mapStructures: DashboardStructure[] = [];
    let versions: DashboardVersion[] = [];

    if (!isLoading && data && data.result) {
        listStructures = data.result.structures.filter((t) => t.type === 'list');
        mapStructures = data.result.structures.filter((t) => t.type === 'map');
        versions = data.result.versions;
    }

    return (
        <div className={classNames(styles.root, contentContainerStyles.root, animationStyles.initialAnimation)}>
            <div className={styles.structuresRoot}>
                <StructureMain listStructures={listStructures} mapStructures={mapStructures} error={error} />
                <VersionMain versions={versions} />
            </div>

            <ResentMain />
        </div>
    );
}
