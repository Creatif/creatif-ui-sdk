// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import versionList from '@app/routes/publishing/css/versionList.module.css';
import React, { useEffect } from 'react';
import { Button, Pill } from '@mantine/core';
import { useQuery } from 'react-query';
import appDate from '@lib/helpers/appDate';
import Copy from '@app/components/Copy';
import { DeleteButton } from '@app/routes/publishing/DeleteButton';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import { IconBox } from '@tabler/icons-react';
import { ToggleButton } from '@app/routes/publishing/ToggleProductionButton';
import { Link } from 'react-router-dom';
import type { Version } from '@root/types/api/public';
import { getVersions } from '@lib/publicApi/app/versions/getVersions';
import type { Result } from '@root/types/api/publicApi/Http';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/systems/runtime/Runtime';

interface Props {
    onListLength: (l: number) => void;
}

export function VersionList({ onListLength }: Props) {
    initialize(Runtime.instance.currentProjectCache.getProject().id);

    const { data, error } = useQuery<Result<Version[]>, ApiError>(
        'get_versions',
        async () => {
            const { result, error } = await getVersions();
            if (error) {
                throw error;
            }

            return { result, error };
        },
        {
            keepPreviousData: true,
            staleTime: Infinity,
        },
    );

    useEffect(() => {
        if (data && data.result) {
            onListLength(data.result.length || 0);
        }
    }, [data]);

    return (
        <>
            <div className={versionList.gridRoot}>
                {Boolean(data?.result?.length) && (
                    <div className={versionList.columnGrid}>
                        <p className={versionList.column}>NAME</p>
                        <p className={versionList.column}>LIVE</p>
                        <p className={versionList.column}>CREATED AT</p>
                        <p className={versionList.column} />
                    </div>
                )}

                <div className={versionList.row}>
                    {data?.result?.length === 0 && (
                        <div className={versionList.listEmpty}>
                            <IconBox color="var(--mantine-color-gray-6)" size={64} />
                            <p>THERE ARE NO PUBLISHED VERSIONS</p>
                        </div>
                    )}

                    {error && <UIError title="Failed to fetch the list of versions" />}

                    {data &&
                        data.result &&
                        data.result.map((item) => (
                            <div key={item.id} className={versionList.itemRoot}>
                                <div className={versionList.nameWrapper}>
                                    <p>{item.name.length > 8 ? `${item.name.substring(0, 12)}...` : item.name}</p>
                                    <Copy onClick={() => navigator.clipboard.writeText(item.name || '')} />
                                </div>
                                <div>
                                    {item.isProductionVersion ? (
                                        <Pill
                                            styles={{
                                                root: {
                                                    backgroundColor: 'var(--mantine-color-green-2)',
                                                    color: 'var(--mantine-color-gray-9)',
                                                },
                                            }}
                                            color="green">
                                            Yes
                                        </Pill>
                                    ) : (
                                        <Pill
                                            styles={{
                                                root: {
                                                    backgroundColor: 'var(--mantine-color-red-2)',
                                                    color: 'var(--mantine-color-gray-9)',
                                                },
                                            }}>
                                            No
                                        </Pill>
                                    )}
                                </div>
                                <p>{appDate(item.createdAt)}</p>
                                <div className={versionList.actionGroup}>
                                    <Button
                                        component={Link}
                                        to={`${Runtime.instance.rootPath()}/api`}
                                        size="compact-xs"
                                        variant="outline">
                                        Explore API
                                    </Button>

                                    <ToggleButton versionId={item.id} isInProduction={item.isProductionVersion} />

                                    <DeleteButton id={item.id} />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
