import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import transformDate from '@lib/helpers/transformDate';
import { DateInput } from '@mantine/dates';
import parse from 'date-fns/parse';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { DateInputProps } from '@mantine/dates';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';

interface Props extends DateInputProps {
    name: string;
    format?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    onInputChange?: (date: string) => void;
}

export function InputDateControlled({ name, format = 'do MMMM, yyyy', options, onInputChange, ...rest }: Props) {
    const { control, getValues } = useFormContext();
    let def = getValues(name);
    if (typeof def === 'string' && def) {
        def = parse(def, format, new Date());
    }

    const [value, setValue] = useState<Date | null>(def);

    return (
        <Controller
            rules={options}
            control={control}
            render={({ field: { onChange: onChange } }) => (
                <DateInput
                    error={useFirstError(name)}
                    value={value}
                    onChange={(value) => {
                        setValue(value);
                        const transformedDate = transformDate(value, format);
                        onChange(transformedDate);
                        onInputChange?.(transformedDate);
                    }}
                    {...rest}
                />
            )}
            name={name}
        />
    );
}
