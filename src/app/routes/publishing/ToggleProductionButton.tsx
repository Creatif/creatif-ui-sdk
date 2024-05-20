import { Button } from '@mantine/core';
import React, { useCallback, useEffect, useState, memo } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toggleProduction } from '@lib/api/publishing/toggleProduction';
import { Runtime } from '@app/systems/runtime/Runtime';
import useNotification from '@app/systems/notifications/useNotification';
import ConfirmationModal from '@app/uiComponents/shared/modals/ConfirmationModal';

interface Props {
    versionId: string;
    isInProduction: boolean;
}

function ToggleProductionButton({ versionId, isInProduction }: Props) {
    const { error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);

    const { isLoading, mutate, isSuccess } = useMutation(
        () =>
            toggleProduction({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                id: versionId,
            }),
        {
            onError() {
                errorNotification('Something went wrong.', 'Please, try again later');
            },
            onSuccess() {
                queryClient.invalidateQueries('get_versions');
                if (openConfirmationModal) {
                    setOpenConfirmationModal(false);
                }
            },
        },
    );

    const onDisable = useCallback(() => {
        if (isInProduction) {
            setOpenConfirmationModal(true);
            return;
        }

        mutate();
    }, [isInProduction]);

    return (
        <>
            {isInProduction && (
                <Button disabled={isLoading} onClick={onDisable} size="compact-xs" color="red" variant="outline">
                    Disable
                </Button>
            )}

            {!isInProduction && (
                <Button disabled={isLoading} onClick={() => mutate()} size="compact-xs" color="green" variant="outline">
                    Enable
                </Button>
            )}

            <ConfirmationModal
                open={openConfirmationModal}
                message="After this operation, there will be no live version of this API. If you are using this version anywhere, it will fail."
                header="Disabling a live version"
                onClose={() => setOpenConfirmationModal(false)}
                onConfirm={() => mutate()}
            />
        </>
    );
}

export const ToggleButton = memo(ToggleProductionButton);
