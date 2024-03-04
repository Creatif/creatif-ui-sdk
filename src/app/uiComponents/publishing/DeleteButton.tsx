import { ActionIcon, Loader } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import versionList from '@app/uiComponents/publishing/css/versionList.module.css';
import { IconTrash } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { removeVersion } from '@lib/api/publishing/removeVersion';
import { Runtime } from '@app/runtime/Runtime';
import useNotification from '@app/systems/notifications/useNotification';
import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';

interface Props {
    id: string;
}

export function DeleteButton({ id }: Props) {
    const { success, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const { isLoading: isDeleting, mutate: deleteVersion } = useMutation(
        (model: { id: string }) =>
            removeVersion({
                projectId: Runtime.instance.credentials.projectId,
                id: model.id,
            }),
        {
            onError: () => {
                errorNotification('Delete version failed', 'Version failed to delete. Please, try again later');
            },
            onSuccess() {
                success('Version deleted', 'Version has been successfully deleted.');
                queryClient.invalidateQueries('get_versions');
            },
        },
    );

    return (
        <>
            <ActionIcon
                onClick={() => {
                    setOpenDeleteModal(true);
                }}
                classNames={{
                    root: versionList.actionIconDeleteOverride,
                }}
                variant="filled"
                radius="xl">
                {isDeleting && <Loader size={15} color="var(--mantine-color-indigo-9)" />}
                {!isDeleting && <IconTrash color="var(--mantine-color-red-9)" size={16} />}
            </ActionIcon>

            <DeleteModal
                open={openDeleteModal}
                message="This version will be permanently deleted. If you are using it in production, your production API will to be working anymore. Are you sure you wish to do this? This action cannot be undone "
                onClose={() => {
                    setOpenDeleteModal(false);
                }}
                onDelete={() => {
                    deleteVersion({
                        id: id,
                    });
                    setOpenDeleteModal(false);
                }}
            />
        </>
    );
}
