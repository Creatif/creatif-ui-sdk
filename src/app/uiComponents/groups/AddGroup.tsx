import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/groups/css/addGroup.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import classNames from 'classnames';
import { useGetGroups } from '@app/uiComponents/groups/hooks/useGetGroups';
import type { TryResult } from '@root/types/shared';
import { useMutation } from 'react-query';
import { addGroups } from '@lib/api/groups/addGroups';
import { Runtime } from '@app/runtime/Runtime';
import type { ApiError } from '@lib/http/apiError';
import type { AddGroupsBlueprint } from '@root/types/api/groups';
import useNotification from '@app/systems/notifications/useNotification';
import { useEffect, useState } from 'react';
import { MultiSelectNoDropdown } from '@app/uiComponents/groups/components/MultiSelectNoDropdown';

export function AddGroup() {
    const methods = useForm<{ groups: string[] }>({
        defaultValues: {
            groups: [],
        },
    });

    const { success } = useNotification();

    const [isFormDirty, setIsFormDirty] = useState(false);
    const { isFetching, data, error } = useGetGroups<TryResult<string[]>>();
    const {
        isLoading,
        error: addGroupsError,
        isSuccess,
        mutate,
    } = useMutation<unknown, ApiError, AddGroupsBlueprint>((data) => addGroups(data));

    useEffect(() => {
        if (!isLoading && isSuccess) {
            success('Groups saved', 'Your groups save been successfully saved.');
            setIsFormDirty(false);
        }
    }, [isLoading, isSuccess]);

    const loadError = error ? 'Groups failed to load. Please, try again later.' : undefined;
    const saveError = addGroupsError ? 'Groups failed to save. Please, try again later.' : undefined;

    return (
        <div className={classNames(contentContainerStyles.root, styles.root)}>
            <p className={styles.info}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque suscipit odio non iaculis
                vehicula. Duis vel pharetra neque. Donec ullamcorper nisi id nulla sollicitudin cursus. Sed commodo
                maximus sagittis. Mauris eu diam arcu. Duis maximus aliquam venenatis. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus.
            </p>

            <div className={styles.formWrapper}>
                {!isFetching && data?.result && (
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit((data) => {
                                mutate({
                                    groups: data.groups,
                                    projectId: Runtime.instance.credentials.projectId,
                                });
                            })}
                            className={styles.form}>
                            <MultiSelectNoDropdown
                                onDirty={() => {
                                    setIsFormDirty(true);
                                }}
                                name="groups"
                                isLoading={false}
                                error={loadError || saveError ? (loadError ? loadError : saveError) : undefined}
                                currentValues={data.result}
                                label="Groups"
                            />

                            <div
                                style={{
                                    alignSelf: 'flex-end',
                                }}>
                                <Button disabled={isLoading || isFetching || !isFormDirty} type="submit">
                                    Add
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </div>
        </div>
    );
}
