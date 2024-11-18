import { Button, Group } from '@mantine/core';
import React from 'react';
import type { GlobalLoadingStore } from '@app/systems/stores/globalLoading';
import { useFormContext } from 'react-hook-form';

interface Props {
    isUpdate: boolean;
    isSaving: boolean;
    globalLoadingStore: GlobalLoadingStore;
}

export function SubmitButton({ isUpdate, isSaving, globalLoadingStore }: Props) {
    const loaders = globalLoadingStore((current) => current.loaders);
    const { trigger } = useFormContext();

    return (
        <Group justify="end">
            <Button
                onClick={() => trigger()}
                loaderProps={{ size: 14 }}
                loading={isSaving || loaders !== 0}
                type="submit">
                {isUpdate && 'Update'}
                {!isUpdate && 'Create'}
            </Button>
        </Group>
    );
}
