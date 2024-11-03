import { FormProvider, useForm } from 'react-hook-form';
import { Button, Loader, TextInput } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/publishing/css/publishForm.module.css';
import useNotification from '@app/systems/notifications/useNotification';
import { useMutation, useQueryClient } from 'react-query';
import { publish } from '@lib/api/publishing/publish';
import { Runtime } from '@app/systems/runtime/Runtime';
import { useEffect } from 'react';
import { IconStackPush } from '@tabler/icons-react';
import type { ApiError } from '@lib/http/apiError';
import { BasicInfo } from '@app/components/BasicInfo';

interface Props {
    listLength: number;
    onPublishInProgress: (isInProgress: boolean) => void;
    isUpdateInProgress: boolean;
}

export function PublishForm({ listLength, onPublishInProgress, isUpdateInProgress }: Props) {
    const queryClient = useQueryClient();
    const methods = useForm({
        mode: 'onChange',
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
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                name: model.versionName,
            }),
    );

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
        <>
            <BasicInfo>
                In Creatif, any version can be used. The default up to date version is used when you don&apos;t specify
                what version you want to use with <span className={styles.highlightInfoText}>X-Creatif-Version</span>{' '}
                header
            </BasicInfo>

            <FormProvider {...methods}>
                <form
                    onSubmit={handleSubmit((data) => {
                        onPublishInProgress(true);
                        mutate({
                            versionName: data.versionName,
                        });
                    })}
                    className={styles.root}>
                    <TextInput
                        error={
                            (error &&
                                error.error &&
                                error.error.data['versionExists'] &&
                                'Version with this name already exists') ||
                            errors.versionName?.message
                        }
                        disabled={isLoading || listLength === -1 || isUpdateInProgress}
                        placeholder="Version name"
                        {...register('versionName', {
                            required: 'Version name is required',
                        })}
                    />

                    <div className={styles.buttonGroup}>
                        <Button
                            type="submit"
                            color="green"
                            disabled={isLoading || listLength === -1 || isUpdateInProgress}
                            leftSection={isLoading ? <Loader color="gray" size={18} /> : <IconStackPush size={24} />}>
                            {isLoading ? 'Publishing' : 'Publish'}
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}
