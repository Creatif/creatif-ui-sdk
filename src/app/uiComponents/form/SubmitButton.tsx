import { Button, Group } from '@mantine/core';
import React from 'react';
import type { GlobalLoadingStore } from '@app/systems/stores/globalLoading';

interface Props {
    isUpdate: boolean;
    isSaving: boolean;
    globalLoadingStore: GlobalLoadingStore;
}

export function SubmitButton({ isUpdate, isSaving, globalLoadingStore }: Props) {
    const loaders = globalLoadingStore((current) => current.loaders);

    return (
        <Group justify="end">
            <Button loaderProps={{ size: 14 }} loading={isSaving || loaders !== 0} type="submit">
                {isUpdate && 'Update'}
                {!isUpdate && 'Create'}
            </Button>
        </Group>
    );
}
