import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Chip } from '@mantine/core';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/InputChip.module.css';
import type { ChipProps } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
interface Props extends ChipProps {
    name: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (checked: boolean) => void;
}
export function InputChipControlled({ name, options, onInputChange, children, ...rest }: Props & PropsWithChildren) {
    const { control, getValues } = useFormContext();
    const [checked, setChecked] = useState<boolean | undefined>(getValues(name));
    const err = useFirstError(name);

    return (
        <Controller
            rules={options}
            control={control}
            name={name}
            render={({ field: { onChange: onChange } }) => (
                <>
                    <Chip
                        checked={checked}
                        className={err ? styles.root : undefined}
                        onChange={(value) => {
                            onChange(value);
                            onInputChange?.(value);
                            setChecked((value) => !value);
                        }}
                        {...rest}>
                        {children}
                    </Chip>

                    {err && <span className={styles.errorMessage}>{err}</span>}
                </>
            )}
        />
    );
}
