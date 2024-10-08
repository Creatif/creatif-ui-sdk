import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { NumberInput } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { NumberInputProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
interface Props extends NumberInputProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (checked: string | number) => void;
}
export function InputNumberControlled({ name, onInputChange, options, ...rest }: Props) {
    const { control, getValues } = useFormContext();
    const [value, setValue] = useState<string | number>(getValues(name));

    return (
        <Controller
            rules={options}
            control={control}
            name={name}
            render={({ field: { onChange: onChange } }) => (
                <>
                    <NumberInput
                        value={value}
                        error={useFirstError(name)}
                        onChange={(value) => {
                            onChange(value);
                            onInputChange?.(value);
                            setValue(value);
                        }}
                        {...rest}
                    />
                </>
            )}
        />
    );
}
