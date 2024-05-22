import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/groups/css/addGroup.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import classNames from 'classnames';
import { useGetGroups } from '@app/routes/groups/hooks/useGetGroups';
import type { TryResult } from '@root/types/shared';
import { useMutation } from 'react-query';
import { addGroups } from '@lib/api/groups/addGroups';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { ApiError } from '@lib/http/apiError';
import type { AddGroupsBlueprint, Group, SingleGroupBlueprint } from '@root/types/api/groups';
import useNotification from '@app/systems/notifications/useNotification';
import { useEffect, useState } from 'react';
import type { InternalGroup } from '@app/routes/groups/components/MultiSelectNoDropdown';
import { MultiSelectNoDropdown } from '@app/routes/groups/components/MultiSelectNoDropdown';

export default function AddGroup() {
    const methods = useForm<{ groups: InternalGroup[] }>({
        defaultValues: {
            groups: [],
        },
    });

    const { success } = useNotification();

    const [isFormDirty, setIsFormDirty] = useState(false);
    const { isFetching, data, error } = useGetGroups<TryResult<Group[]>>();

    const {
        isLoading,
        error: addGroupsError,
        isSuccess,
        mutate,
    } = useMutation<unknown, ApiError, AddGroupsBlueprint>((data) => addGroups(data));

    useEffect(() => {
        if (!isLoading && !addGroupsError && isSuccess) {
            success('Groups saved', 'Your groups save been successfully saved.');
            setIsFormDirty(false);
        }
    }, [isLoading, isSuccess]);

    const loadError = error ? 'Groups failed to load. Please, try again later.' : undefined;
    const saveError = addGroupsError ? 'Groups failed to save. Please, try again later.' : undefined;

    return (
        <div className={classNames(contentContainerStyles.root, styles.root)}>
            <div className={styles.info}>
                Groups are a way to group and filter your items. When you create groups, you can assign them to your
                items and filter them by those groups. For example, if you create Hotel items, you might give them
                groups like 1 star, 2 star etc...
                <div className={styles.danger}>
                    <span className={styles.important}>Important</span>
                    <p>
                        If you add some of your groups to your items but delete those groups here, they will also be
                        deleted in your items.
                    </p>
                </div>
            </div>

            <div className={styles.formWrapper}>
                {!isFetching && data?.result && (
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit((data) => {
                                mutate({
                                    groups: data.groups as SingleGroupBlueprint[],
                                    projectId: Runtime.instance.currentProjectCache.getProject().id,
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
