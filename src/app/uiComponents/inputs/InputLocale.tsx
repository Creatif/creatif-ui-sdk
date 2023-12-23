import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { ComboboxItem, SelectProps } from '@mantine/core';
import { Select } from '@mantine/core';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import { Initialize } from '@app/initialize';
import LocalesCache from '@lib/storage/localesCache';
export interface InputLocaleProps extends SelectProps {
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
function createOptions(locales: Locale[]) {
    return locales.map((item) => ({
        label: `${item.name} - ${item.alpha}`,
        value: item.alpha,
    }));
}
export default function InputLocale({ store, validation, ...rest }: InputLocaleProps) {
    const { control, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState(store.getState().locale || Initialize.Locale());
    const locales: Locale[] = LocalesCache.instance.getLocales() || [];

    useEffect(() => {
        setFormValue('locale', value);
    }, []);

    return (
        <Controller
            control={control}
            name="locale"
            rules={
                !validation
                    ? {
                          required: 'Locale field is required.',
                      }
                    : validation
            }
            render={({ field: { onChange } }) => (
                <Select
                    label="Locale"
                    searchable
                    clearable
                    error={useFirstError('locale')}
                    data={createOptions(locales)}
                    value={value}
                    filter={({ options, search }) => {
                        const filtered = (options as ComboboxItem[]).filter((option) =>
                            option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                        );

                        filtered.sort((a, b) => a.label.localeCompare(b.label));
                        return filtered;
                    }}
                    onChange={(value) => {
                        if (value) {
                            onChange(value);
                            setValue(value);
                        }
                    }}
                    name="locale"
                    {...rest}
                />
            )}
        />
    );
}
