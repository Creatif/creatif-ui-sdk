import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { ComboboxItem, SelectProps } from '@mantine/core';
import { Select } from '@mantine/core';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import { Runtime } from '@app/runtime/Runtime';
import { localeField } from '@app/uiComponents/form/bindings/bindingResolver';
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
export function InputLocale({ store, validation, ...rest }: InputLocaleProps) {
    const { control, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState(store.getState().locale || Runtime.instance.currentLocaleStorage.getLocale());
    const locales: Locale[] = Runtime.instance.localesCache.getLocales() || [];
    const name = localeField;

    useEffect(() => {
        store.getState().addField(name);
        setFormValue(name, value);

        return () => store.getState().removeField(name);
    }, []);

    return (
        <Controller
            control={control}
            name={name}
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
                    error={useFirstError(name)}
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
                    name={name}
                    {...rest}
                />
            )}
        />
    );
}
