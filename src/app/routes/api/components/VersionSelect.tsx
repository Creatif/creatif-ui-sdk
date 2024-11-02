import { useQuery } from 'react-query';
import type { Version } from '@root/types/api/public';
import type { ApiError } from '@lib/http/apiError';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getVersions } from '@lib/publicApi/app/versions/getVersions';
import type { Result } from '@root/types/api/publicApi/Http';

interface Props {
    onVersionChange: (id: string) => void;
    currentVersion: string | null;
}

export function VersionSelect({ onVersionChange, currentVersion }: Props) {
    const [selectedVersion, setSelectedVersion] = useState<string>(currentVersion || '');
    const { data, isFetching, error } = useQuery<Result<Version[]>, ApiError>('get_versions', () => getVersions(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    const componentError = error
        ? 'Versions could not be loaded. Please, try again later.'
        : data && data.result && data.result.length === 0
        ? 'There are no published version. Publish a version first to use the API.'
        : undefined;

    useEffect(() => {
        if (!isFetching && data && data.result) {
            if (data.result.length === 0) {
                return;
            }

            if (currentVersion) return;

            for (const item of data.result) {
                if (item.isProductionVersion) {
                    onVersionChange(item.name);
                    setSelectedVersion(item.name);
                    return;
                }
            }

            const version = data.result[0];
            setSelectedVersion(version.id);
            onVersionChange(version.name);
        }
    }, [isFetching, data]);

    const selectData =
        data &&
        data.result &&
        data.result.map((item) => ({
            label: `${item.isProductionVersion ? item.name + ' (in production)' : item.name}`,
            value: item.name,
        }));

    console.log(selectData);

    return (
        <Select
            onChange={(item) => {
                if (currentVersion === item) return;

                setSelectedVersion(item || currentVersion || '');
                onVersionChange(item || currentVersion || '');
            }}
            error={componentError}
            description="Select a version to use to make API requests"
            value={selectedVersion}
            disabled={isFetching}
            label="Versions"
            placeholder="Select a version"
            data={selectData}
        />
    );
}
