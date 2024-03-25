import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { RangeSlider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/InputSlider.module.css';
import type { RangeSliderProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends RangeSliderProps {
    name: string;
    onInputChange?: (value: [number, number]) => void;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

function resolveDefaultValue(
    def: [number, number] | undefined,
    current: [number, number] | undefined,
): [number, number] {
    if (!def && !current) {
        return [0, 0];
    }

    if (Array.isArray(def) && def.length === 2) {
        return def;
    }

    if (Array.isArray(current) && current.length === 2) {
        return current;
    }

    return [0, 0];
}
export function InputRangeSliderControlled({ name, validation, onInputChange, defaultValue, ...rest }: Props) {
    const { control, getValues, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState<[number, number] | undefined>(
        resolveDefaultValue(defaultValue, getValues(name)),
    );
    const error = useFirstError(name);

    useEffect(() => {
        setFormValue(name, value);
    }, []);

    return (
        <>
            <Controller
                rules={validation}
                control={control}
                name={name}
                render={({ field: { onChange } }) => (
                    <RangeSlider
                        value={value}
                        name={name}
                        onChange={(value) => {
                            setValue(value);
                        }}
                        onChangeEnd={(value) => {
                            onChange(value);
                            onInputChange?.(value);
                            setValue(value);
                        }}
                        {...rest}
                    />
                )}
            />

            {error && <span className={styles.errorMessage}>{error}</span>}
        </>
    );
}
