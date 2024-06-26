import { InputText } from '@app/uiComponents/inputs/InputText';
import type { TextInputProps } from '@mantine/core';
import type { RegisterOptions } from 'react-hook-form';
interface Props extends TextInputProps {
    name: string;
    options?: RegisterOptions;
}
export function InputEmail({ options, ...rest }: Props) {
    const optionsCopy: RegisterOptions = {
        ...options,
        valueAsNumber: false,
        valueAsDate: false,
        pattern: options?.pattern
            ? options.pattern
            : {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Provided email is invalid',
              },
    };

    return <InputText {...rest} options={optionsCopy} />;
}
