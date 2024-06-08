import { SegmentedControl } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { SegmentedControlProps, SegmentedControlItem } from '@mantine/core';

function isSegmentedControlItem(value: unknown): value is SegmentedControlItem {
    if (!Array.isArray(value)) {
        return false;
    }

    if (typeof value[0] === 'string') {
        return false;
    }

    return Object.hasOwn(value[0], 'label') && Object.hasOwn(value[0], 'value');
}
interface Props extends SegmentedControlProps {
    name: string;
    onInputChange?: (value: string) => void;
    data: string[] | SegmentedControlItem[];
}
export function InputSegmentedControlControlled({ name, onInputChange, data, ...rest }: Props) {
    if (data.length === 0)
        throw new Error('\'data\' cannot be an empty array. It must be a string[] or SegmentedControlItem');

    const { control, getValues, setValue: setFormValue } = useFormContext();

    const defaultValue: string | undefined = getValues(name);

    const [value, setValue] = useState<string | undefined>(() => {
        if (isSegmentedControlItem(defaultValue)) {
            return defaultValue.value;
        }

        if (defaultValue) {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (isSegmentedControlItem(value)) {
            setFormValue(name, value.value);
        }

        if (value) {
            setFormValue(name, value);
        }
    }, [value]);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange } }) => (
                <SegmentedControl
                    value={value}
                    data={data}
                    onChange={(value) => {
                        onChange(value);
                        onInputChange?.(value);
                        setValue(value);
                    }}
                    {...rest}
                />
            )}
        />
    );
}
