import type { Version } from '@root/types/api/publicApi/Version';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import versionList from '@app/routes/publishing/css/versionList.module.css';
import Copy from '@app/components/Copy';
import appDate from '@lib/helpers/appDate';
import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Runtime } from '@app/systems/runtime/Runtime';
import { DeleteButton } from '@app/routes/publishing/DeleteButton';
import React, { useEffect } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import { useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import { updatePublished } from '@lib/api/publishing/updatePublished';
import useNotification from '@app/systems/notifications/useNotification';

interface Props {
    version: Version;
    onUpdateInProgress: (isInProgress: boolean) => void;
    isUpdateInProgress: boolean;
}

export function Item({ version, onUpdateInProgress, isUpdateInProgress }: Props) {
    const queryClient = useQueryClient();
    const { success, error: errorNotification } = useNotification();
    const { isLoading, error, data, mutate } = useMutation<unknown, ApiError, { versionName: string }>(
        (model: { versionName: string }) =>
            updatePublished({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                name: model.versionName,
            }),
    );

    useEffect(() => {
        onUpdateInProgress(false);
        if (error) {
            errorNotification('Failed to publish.', 'Something went wrong. Please, try publishing later.');
        }

        if (data) {
            success('Version updated', 'Your data has been successfully updated.');
            queryClient.invalidateQueries('get_versions');
        }
    }, [error, data]);

    return (
        <div className={versionList.itemRoot}>
            <div className={versionList.nameWrapper}>
                <p>{version.name.length > 8 ? `${version.name.substring(0, 12)}...` : version.name}</p>
                <Copy onClick={() => navigator.clipboard.writeText(version.name || '')} />
            </div>
            <p>{appDate(version.createdAt)}</p>
            <div className={versionList.actionGroup}>
                <div className={versionList.actionItemLeft}>
                    <Button
                        component={Link}
                        to={`${Runtime.instance.rootPath()}/api?version=${version.name}`}
                        size="compact-xs"
                        variant="outline">
                        Explore API
                    </Button>

                    <DeleteButton id={version.id} />
                </div>

                <Button
                    disabled={isUpdateInProgress}
                    loading={isLoading}
                    onClick={() => {
                        onUpdateInProgress(true);

                        mutate({
                            versionName: version.name,
                        });
                    }}
                    leftSection={<IconRefresh size={16} />}
                    color="green"
                    variant="outline">
                    Update
                </Button>
            </div>
        </div>
    );
}
