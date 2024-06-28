import { Button, Group } from '@mantine/core';
import React from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { GlobalLoadingStoreData } from '@app/systems/stores/globalLoading';

interface Props {
    isUpdate: boolean;
    isSaving: boolean;
    globalLoadingStore: UseBoundStore<StoreApi<GlobalLoadingStoreData>>;
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
