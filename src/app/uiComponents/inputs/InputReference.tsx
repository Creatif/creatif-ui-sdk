import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete } from '@mantine/core';
import paginateList from '@lib/api/declarations/lists/paginateList';
import paginateMap from '@lib/api/declarations/maps/paginateMap';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import { useDebouncedValue } from '@mantine/hooks';
import type { StructureType } from '@root/types/shell/shell';
import { Initialize } from '@app/initialize';
import { Controller, useFormContext } from 'react-hook-form';
import type { ApiError } from '@lib/http/apiError';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';

export interface ReferenceValue {
    structureName: string;
    structureType: StructureType;
    value: string;
}

interface Props {
    structureName: string;
    structureType: StructureType;
    placeholder: string;
    label?: string;
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
}

function usePagination(structureName: string, structureType: StructureType) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [error, setError] = useState<ApiError | undefined>();

    const paginate = useCallback((search: string) => {
        setIsLoading(true);

        if (structureType === 'list') {
            paginateList({
                search: search,
                name: structureName,
                limit: 1000,
                page: 1,
                orderBy: 'created_at',
                projectId: Initialize.ProjectID(),
            }).then(({ result, error }) => {
                setIsLoading(false);

                if (result && result.data) {
                    setOptions(
                        result.data.map((item) => ({
                            label: item.name,
                            value: item.id,
                        })),
                    );
                }

                if (error) {
                    setError(error);
                }
            });

            return;
        }

        if (structureType === 'map') {
            paginateMap({
                search: search,
                name: structureName,
                limit: 100,
                page: 1,
                projectId: Initialize.ProjectID(),
            }).then(({ result, error }) => {
                setIsLoading(false);

                if (result && result.data) {
                    setOptions(
                        result.data.map((item) => ({
                            label: item.name,
                            value: item.id,
                        })),
                    );
                }

                if (error) {
                    setError(error);
                }
            });

            return;
        }

        paginateVariables({
            search: search,
            name: structureName,
            limit: 100,
            page: 1,
            projectId: Initialize.ProjectID(),
        }).then(({ result, error }) => {
            setIsLoading(false);

            if (result && result.data) {
                setOptions(
                    result.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })),
                );
            }

            if (error) {
                setError(error);
            }
        });
    }, []);

    return {
        data: options,
        isLoading,
        error,
        paginate: paginate,
    };
}

export default function InputReference({ structureName, structureType, placeholder, label }: Props) {
    const [search, setSearch] = useState<string>('');
    const { data, paginate, isLoading, error } = usePagination(structureName, structureType);
    const { control, setValue: setFormValue } = useFormContext();
    const name = `${structureName}_${structureType}_reference`;

    const [debounced] = useDebouncedValue(search, 200);

    useEffect(() => {
        paginate(debounced);
    }, [debounced]);

    return (
        <Controller
            control={control}
            render={({ field: { onChange } }) => (
                <Autocomplete
                    error={
                        error &&
                        `Structure '${structureName}' could not be fetched at this moment. Please, try again later.`
                    }
                    disabled={isLoading}
                    value={search}
                    onChange={(item) => {
                        setSearch(item);
                        onChange({
                            structureType: structureType,
                            structureName: structureName,
                            value: item,
                        });
                    }}
                    label={label}
                    placeholder={placeholder}
                    data={data}
                />
            )}
            name={name}
        />
    );
}
