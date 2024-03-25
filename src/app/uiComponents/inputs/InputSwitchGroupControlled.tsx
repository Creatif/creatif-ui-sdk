import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Switch } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { SwitchGroupProps } from '@mantine/core';
import type { PropsWithChildren, ReactNode } from 'react';
import type { RegisterOptions, FieldValues, FormState } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface Props extends SwitchGroupProps {
    name: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (value: string[]) => void;
    component?: (data: { value: string[]; formState: FormState<FieldValues> }) => React.ReactNode;
    children?: ReactNode;
}
export function InputSwitchGroupControlled({
    name,
    validation,
    onInputChange,
    children,
    component,
    ...rest
}: Props & PropsWithChildren) {
    if (!component && !children)
        throw new Error(
            `InputSwitchGroupControlled component with name '${name}' did not provided either children or component(). You must provide either children or component().`,
        );
    const { control, getValues, formState, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState<string[]>(getValues(name));

    useEffect(() => {
        setFormValue(name, value);
    }, []);

    return (
        <Controller
            control={control}
            render={({ field: { onChange } }) => (
                <Switch.Group
                    value={value}
                    error={useFirstError(name)}
                    onChange={(value) => {
                        onChange(value);
                        onInputChange?.(value);
                        setValue(value);
                    }}
                    {...rest}>
                    {component ? component({ value: value, formState: formState }) : children}
                </Switch.Group>
            )}
            name={name}
            rules={validation}
        />
    );
}
