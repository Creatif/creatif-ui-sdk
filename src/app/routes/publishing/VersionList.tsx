// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import versionList from '@app/routes/publishing/css/versionList.module.css';
import React, { useEffect, useState } from 'react';
import { Button } from '@mantine/core';
import { useQuery } from 'react-query';
import appDate from '@lib/helpers/appDate';
import Copy from '@app/components/Copy';
import { DeleteButton } from '@app/routes/publishing/DeleteButton';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import { IconBox } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Version } from '@root/types/api/public';
import { getVersions } from '@lib/publicApi/app/versions/getVersions';
import type { Result } from '@root/types/api/publicApi/Http';
import { initialize } from '@lib/publicApi/app/initialize';
import { Runtime } from '@app/systems/runtime/Runtime';
import { DefaultResult } from '@app/routes/publishing/DefaultResult';
import { Item } from '@app/routes/publishing/Item';
import { ResultHeader } from '@app/routes/publishing/ResultHeader';

interface Props {
    onListLength: (l: number) => void;
    onUpdateInProgress: (isInProgress: boolean) => void;
    isPublishInProgress: boolean;
}

export function VersionList({ onListLength, isPublishInProgress, onUpdateInProgress }: Props) {
    initialize(Runtime.instance.currentProjectCache.getProject().id);

    const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);

    const { data, error, isLoading } = useQuery<Result<Version[]>, ApiError>(
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

    useEffect(() => {
        onUpdateInProgress(isUpdateInProgress);
    }, [isUpdateInProgress]);

    useEffect(() => {
        setIsUpdateInProgress(isPublishInProgress);
    }, [isPublishInProgress]);

    let defaultVersion: Version | undefined;
    let results: Version[] = [];
    let hasVersions = false;
    if (!isLoading && data && data.result && data.result) {
        results = data.result;
        hasVersions = data.result.length !== 0;

        if (results.length !== 0) {
            const copy = [...results];
            defaultVersion = copy.shift();
            results = copy;
        }
    }

    return (
        <>
            {defaultVersion && (
                <DefaultResult
                    isUpdateInProgress={isUpdateInProgress}
                    onUpdateInProgress={(isInProgress) => setIsUpdateInProgress(isInProgress)}
                    version={defaultVersion}
                />
            )}

            {!hasVersions && (
                <div className={versionList.listEmpty}>
                    <IconBox color="var(--mantine-color-gray-6)" size={64} />
                    <p>THERE ARE NO PUBLISHED VERSIONS</p>
                </div>
            )}

            {hasVersions && <ResultHeader title="OTHER VERSIONS" />}
            {hasVersions && (
                <div className={versionList.gridRoot}>
                    <div className={versionList.columnGrid}>
                        <p className={versionList.column}>NAME</p>
                        <p className={versionList.column}>CREATED AT</p>
                        <p className={versionList.column} />
                    </div>

                    <div className={versionList.row}>
                        {error && <UIError title="Failed to fetch the list of versions" />}

                        {results.length !== 0 && (
                            <div>
                                {results.map((item) => (
                                    <Item
                                        isUpdateInProgress={isUpdateInProgress}
                                        onUpdateInProgress={(isInProgress) => setIsUpdateInProgress(isInProgress)}
                                        key={item.id}
                                        version={item}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
