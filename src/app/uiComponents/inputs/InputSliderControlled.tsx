import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { Slider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/InputSlider.module.css';
import type { SliderProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends SliderProps {
    name: string;
    onInputChange?: (value: number) => void;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
export function InputSliderControlled({ name, options, onInputChange, ...rest }: Props) {
    const { control, getValues, setValue: setFormValue } = useFormContext();
    const [value, setValue] = useState<number | undefined>(getValues(name));
    const error = useFirstError(name);

    useEffect(() => {
        setFormValue(name, value);
    }, []);

    return (
        <>
            <Controller
                rules={options}
                control={control}
                name={name}
                render={({ field: { onChange } }) => (
                    <Slider
                        name={name}
                        value={value}
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
