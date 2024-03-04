import { FormProvider, useForm } from 'react-hook-form';
import { Button, Loader, TextInput } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/publishing/css/publishForm.module.css';
import useNotification from '@app/systems/notifications/useNotification';
import { useMutation, useQueryClient } from 'react-query';
import { publish } from '@lib/api/publishing/publish';
import { Runtime } from '@app/runtime/Runtime';
import { useEffect, useState } from 'react';
import { IconStackPush } from '@tabler/icons-react';
import type { ApiError } from '@lib/http/apiError';
import { UIWarning } from '@app/components/UIWarning';

interface Props {
    listLength: number;
}

export function PublishForm({ listLength }: Props) {
    const [isMaxVersionsReached, setIsMaxVersionsReached] = useState(false);

    const queryClient = useQueryClient();
    const methods = useForm({
        defaultValues: {
            versionName: '',
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = methods;

    const { success, error: errorNotification } = useNotification();
    const { isLoading, error, data, mutate } = useMutation<unknown, ApiError, { versionName: string }>(
        (model: { versionName: string }) =>
            publish({
                projectId: Runtime.instance.credentials.projectId,
                name: model.versionName,
            }),
    );

    useEffect(() => {
        if (listLength !== -1 && listLength === 2) {
            setIsMaxVersionsReached(true);
            return;
        }

        setIsMaxVersionsReached(false);
    }, [listLength]);

    useEffect(() => {
        if (error && error.error.data['versionExists']) return;

        if (error) {
            errorNotification('Failed to publish.', 'Something went wrong. Please, try publishing later.');
        }

        if (data) {
            success('Version published', 'Your data has been successfully published.');
            reset();
            queryClient.invalidateQueries('get_versions');
        }
    }, [error, data]);

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit((data) => {
                    mutate({
                        versionName: data.versionName,
                    });
                })}
                className={styles.root}>
                {isMaxVersionsReached && (
                    <UIWarning
                        style={{
                            margin: '2rem 0 2rem 0',
                        }}
                        title="Maximum number of versions reached. If you wish to publish a new version, you have to delete one of the current versions."
                    />
                )}

                <TextInput
                    error={
                        (error &&
                            error.error &&
                            error.error.data['versionExists'] &&
                            'Version with this name already exists') ||
                        errors.versionName?.message
                    }
                    disabled={isLoading || listLength === -1 || isMaxVersionsReached}
                    placeholder="Version name"
                    description="Version name is not required. If you choose not give this version a name, a name will be automatically generated for you."
                    {...register('versionName', {
                        required: 'Version name is required',
                    })}
                />

                <div className={styles.buttonGroup}>
                    <Button
                        type="submit"
                        color="green"
                        disabled={isLoading || listLength === -1 || isMaxVersionsReached}
                        leftSection={isLoading ? <Loader color="gray" size={18} /> : <IconStackPush size={24} />}>
                        {isLoading ? 'Publishing' : 'Publish'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
