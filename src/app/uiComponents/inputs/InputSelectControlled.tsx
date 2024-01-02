import { useState } from 'react';
import type { SelectProps } from '@mantine/core';
import { Select } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';

interface Props extends SelectProps {
    name: string;
    data: string[] | { value: string; label: string }[];
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

export function InputSelectControlled({ data, name, ...rest }: Props) {
    const { control } = useFormContext();
    const [value, setValue] = useState<string | null>('');

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange: onChange } }) => (
                <Select
                    error={useFirstError(name)}
                    data={data}
                    value={value}
                    onChange={(value) => {
                        onChange(value);
                        setValue(value);
                    }}
                    {...rest}
                />
            )}
        />
    );
}
