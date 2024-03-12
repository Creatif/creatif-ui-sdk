import { useQuery } from 'react-query';
import type { Version } from '@root/types/api/public';
import type { ApiError } from '@lib/http/apiError';
import { Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getVersions } from '@lib/publicApi/app/versions/getVersions';
import { Result } from '@root/types/api/publicApi/Http';

interface Props {
    onVersionChange: (id: string) => void;
}

export function VersionSelect({ onVersionChange }: Props) {
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const { data, isFetching, error } = useQuery<Result<Version[]>, ApiError>('get_versions', () => getVersions(), {
        keepPreviousData: true,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!isFetching && data && data.result) {
            if (data.result.length === 0) {
                return;
            }

            for (const item of data.result) {
                if (item.isProductionVersion) {
                    onVersionChange(item.id);
                    setSelectedVersion(item.id);
                    return;
                }
            }

            const version = data.result[0];
            setSelectedVersion(version.id);
            onVersionChange(version.id);
        }
    }, [isFetching, data]);

    return (
        <Select
            onChange={(item) => {
                setSelectedVersion(item);
            }}
            error={error && 'Versions could not be loaded. Please, try again later.'}
            description="Select a version to use to make API requests"
            value={selectedVersion}
            disabled={isFetching}
            label="Versions"
            placeholder="Select a version"
            data={data && data.result && data.result.map((item) => ({ label: item.name, value: item.id }))}
        />
    );
}
