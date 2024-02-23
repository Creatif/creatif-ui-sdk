import { Button, Loader } from '@mantine/core';
import { IconStackPush } from '@tabler/icons-react';
import { useMutation } from 'react-query';
import { publish } from '@lib/api/publishing/publish';
import { Runtime } from '@app/runtime/Runtime';
import { useEffect } from 'react';
import useNotification from '@app/systems/notifications/useNotification';

export function PublishButton() {
    const {success, error: errorNotification} = useNotification();
    const {isLoading, error, data, mutate} = useMutation(() => publish({
            projectId: Runtime.instance.credentials.projectId,
        }));

    useEffect(() => {
        if (error) {
            errorNotification('Failed to publish.', 'Something went wrong. Please, try publishing later.');
        }

        if (data) {
            success('Version published', 'Your data has been successfully published.');
        }
    }, [error, data]);


    return <Button onClick={() => mutate()} color="green" disabled={isLoading} leftSection={isLoading ? <Loader size={14} /> : <IconStackPush size={24} />}>
        Publish
    </Button>;
}