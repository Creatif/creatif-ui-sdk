import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Textarea } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { TextareaProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends TextareaProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string) => void;
}
export function InputTextareaControlled({ name, options, onInputChange, ...rest }: Props) {
    const { control, getValues } = useFormContext();
    const [value, setValue] = useState<string>(getValues(name));

    return (
        <Controller
            name={name}
            rules={options}
            control={control}
            render={({ field: { onChange } }) => (
                <Textarea
                    value={value}
                    error={useFirstError(name)}
                    onChange={(event) => {
                        onChange(event.currentTarget.value);
                        onInputChange?.(event.currentTarget.value);
                        setValue(event.currentTarget.value);
                    }}
                    {...rest}
                />
            )}
        />
    );
}
