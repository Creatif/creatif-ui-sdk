import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Switch } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { SwitchProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends SwitchProps {
    name: string;
    onInputChange?: (value: boolean) => void;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    options?: RegisterOptions;
}
export default function InputSwitchControlled({ name, validation, onInputChange, ...rest }: Props) {
    const { control, getValues } = useFormContext();
    const [checked, setChecked] = useState(getValues(name));

    return (
        <Controller
            rules={validation}
            control={control}
            name={name}
            render={({ field: { onChange: onChange } }) => (
                <Switch
                    defaultChecked={checked}
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
