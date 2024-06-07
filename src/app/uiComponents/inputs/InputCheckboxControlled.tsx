import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Checkbox } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { CheckboxProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends CheckboxProps {
    name: string;
    onInputChange?: (value: boolean) => void;
    options?: RegisterOptions;
}
export function InputCheckboxControlled({ name, onInputChange, options, ...rest }: Props) {
    const { control, getValues } = useFormContext();
    const [checked, setChecked] = useState(getValues(name));

    return (
        <Controller
            rules={options}
            control={control}
            name={name}
            render={({ field: { onChange: onChange } }) => (
                <Checkbox
                    checked={checked}
                    value={checked}
                    error={useFirstError(name)}
                    onChange={(event) => {
                        onChange(event.currentTarget.checked);
                        onInputChange?.(event.currentTarget.checked);
                        setChecked(event.currentTarget.checked);
                    }}
                    {...rest}
                />
            )}
        />
    );
}
